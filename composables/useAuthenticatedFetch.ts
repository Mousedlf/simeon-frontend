import Cookies from "universal-cookie";
import { useRequestHeaders } from '#app';

export default async function useAuthenticatedFetch<T>(url: string, options: any = {}) {
    const config = useRuntimeConfig();
    const baseUrl = config.public.baseUrlApi;

    let token = null;

    if (process.server) { // aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        const headers = useRequestHeaders(['cookie']);
        if (headers.cookie) {
            const cookies = new Cookies(headers.cookie);
            token = cookies.get('token');
        }
    }
    else {
        const cookies = new Cookies();
        token = cookies.get('token');
    }

    if (!token) {
        console.error("No token found, redirecting to login.");
        await navigateTo("/login");
        return { data: ref(null), pending: ref(false), error: ref({ message: 'No token found' }), refresh: () => Promise.resolve() };    }

    options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    return useFetch(`${baseUrl}${url}`, options);
}