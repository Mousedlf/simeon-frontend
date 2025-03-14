import {defineStore} from 'pinia';
import Cookies from 'universal-cookie';
import type {UserProfile} from "~/types/profile";

export const useAuthStore = defineStore('auth',
    () => {
        const cookies = new Cookies(null, {path: '/'});
       // const currentUser: UserProfile = ref(null);
        const config = useRuntimeConfig();
        const router = useRouter();

        async function getCurrentUser(): Promise<UserProfile | null> {
            if (!cookies.get('token')) return null;

            try {
                const res = await fetch(`${config.public.baseUrlApi}/user/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + cookies.get('token'),
                    }
                });

                if(!res.ok) return null;

                const userData = await res.json()

                console.log(userData)

                return userData;

            } catch (error) {
                console.error(error);
                return null;
            }
        }

        function authenticated(): boolean {
            return !!cookies.get('token');
        }

        function setToken(token: string) {
            cookies.set('token', token);
        }

        function logout() {
            cookies.remove('token');
            router.push('/login');
        }

        return {cookies, setToken, logout, authenticated, getCurrentUser};
    },
    {persist: true}
)
