import {useAuthStore} from "~/store/auth";

export default defineNuxtRouteMiddleware((to, from) => {

    const authStore = useAuthStore();
    const isAuthenticated = authStore.authenticated;

    if (!isAuthenticated && to.path !== '/login' && to.path !== '/about' && to.path !== '/register' ) {
        return navigateTo('/login')
    }
})