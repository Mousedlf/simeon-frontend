import { ref } from 'vue';
import useAuthenticatedFetch from '~/composables/useAuthenticatedFetch';

export const useCurrenciesStore = defineStore('currencies', () => {
    const currenciesData = ref(null);
    const isLoading = ref(false);
    const error = ref(null);

    const fetchCurrencies = async () => {
        if (currenciesData.value) {
            return;
        }

        isLoading.value = true;
        error.value = null;

        try {
            const { data, error: apiError } = await useAuthenticatedFetch('/currency/all');
            if (apiError.value) {
                error.value = apiError.value;
            } else {
                currenciesData.value = data.value;
            }
        } catch (e) {
            error.value = e;
        } finally {
            isLoading.value = false;
        }
    };

    return { currenciesData, isLoading, error, fetchCurrencies };
});