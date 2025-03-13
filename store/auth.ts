import {defineStore} from 'pinia';
import Cookies from 'universal-cookie';

export const useAuthStore = defineStore('auth',
    () => {
        const cookies = new Cookies(null, {path: '/'});
        const currentUser: any = ref(null);
        const config = useRuntimeConfig();


        // recup currentUser

        function authenticated() {
            return !!cookies.get('token');
        }

        function setToken(token: string) {
            cookies.set('token', token);
        }

        function logout() {
            cookies.remove('token');
        }

        return {cookies, setToken, logout, authenticated};
    },
    { persist: true }
)
