import Cookies from "universal-cookie";

export default async function useAuthenticatedFetch(url: string, options: any = {}) {
    const config = useRuntimeConfig();
    const baseUrl = config.public.baseUrlApi;
    const router = useRouter();

    const cookies = new Cookies();
    const token = cookies.get("token");

    if (!token) {
        router.push("/login");
        return { data: ref(null), pending: ref(false), error: ref('No token found') };
    }

    options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    return useFetch(`${baseUrl}${url}`, options);
}
