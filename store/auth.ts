import Cookies from "universal-cookie";
import type {UserProfile} from "~/types/user-profile";

export const useAuthStore = defineStore('auth', () => {
    const cookies = new Cookies(null, {path: '/'});
    const router = useRouter();

    const token = ref<string | null>(cookies.get('token') || null);
    const authenticated = computed(() => !!token.value);

    const user = ref<UserProfile | null>(null);

    function setCurrentUser(data: UserProfile) {
        if (data) {
            user.value = {
                id: data.id,
                username: data.username,
                email: data.email,
                created_at: data.created_at,
                public: data.public,
                image_src: ''
            };
            // cookies.set('user', user.value);
        }
    }

    function setToken(newToken: string) {
        token.value = newToken;
        cookies.set('token', newToken, {
            path: '/', maxAge: 60 * 60 // une heure
        });
    }

    function logout() {
        token.value = null;
        cookies.remove('token');
        router.push('/login');
    }

    return {token, authenticated, setToken, logout, setCurrentUser, user};
}, {persist: true});
