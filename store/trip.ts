import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Trip } from '~/types/trip';
import useAuthenticatedFetch from '~/composables/useAuthenticatedFetch';

export const useTripStore = defineStore('trip', () => {
    const tripData = ref<Trip | null>(null);
    const isLoading = ref(false);
    const error = ref<any>(null);

    const fetchTripData = async (tripId: string) => {
        isLoading.value = true;
        error.value = null;
        try {
            const { data, error: fetchError } = await useAuthenticatedFetch<Trip | null>(`/trip/${tripId}`);
            if (fetchError.value) {
                throw fetchError.value;
            }
            tripData.value = data.value as Trip;
        } catch (e) {
            error.value = e;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        tripData,
        isLoading,
        error,
        fetchTripData,
    };
});