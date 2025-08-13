import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import useAuthenticatedFetch from '~/composables/useAuthenticatedFetch';
import type { Category } from '~/types/Category';
import type { MappedCategory } from "~/types/MappedCategory";

const categoryMap = {
    transport: { icon: 'ic-baseline-directions-car-filled', name: 'Transport' },
    restaurant: { icon: 'ic-baseline-food-bank', name: 'Restaurant' },
    food: { icon: 'ic-baseline-fastfood', name: 'Nourriture' },
    drinks: { icon: 'i-maki:bar', name: 'Boissons' },
    museum: { icon: 'ic-baseline-museum', name: 'Musée' },
    activity: { icon: 'ic-round-location-on', name: 'Activité' },
    shopping: { icon: 'heroicons:sparkles', name: 'Shopping' },
    groceries: { icon: 'ic-baseline-shopping-cart', name: 'Courses' },
    cleaning: { icon: 'heroicons:sparkles', name: 'Nettoyage' },
    housing: { icon: 'ic-baseline-house', name: 'Hôtel' },
    flight: { icon: 'ic-baseline-airplanemode-active', name: 'Vol' },
    coffee: { icon: 'ic-baseline-local-cafe', name: 'Caffé' },
    withdrawal: { icon: 'streamline-ultimate:accounting-coins', name: 'Retrait' },
    health: { icon: 'ic:baseline-local-hospital', name: 'Santé' },
    gifts: { icon: 'ic:outline-card-giftcard', name: 'Cadeaux' },
    default: { icon: 'fluent:animal-turtle-16-filled', name: 'Pas défini' },
};

export const useExpenseCategoriesStore = defineStore('expense-categories', () => {
    const expenseCategoriesData = ref<Category[] | null>(null);
    const isLoading = ref(false);
    const error = ref(null);

    const mappedCategories = computed<MappedCategory[] | null>(() => {
        if (!expenseCategoriesData.value) {
            return null;
        }

        return expenseCategoriesData.value.map(apiCategory => {
            const categoryInfo = categoryMap[apiCategory.name as keyof typeof categoryMap] || categoryMap.default;

            return {
                id: apiCategory.id,
                name: apiCategory.name,
                displayName: categoryInfo.name,
                icon: categoryInfo.icon,
            };
        });
    });

    const fetchCategories = async () => {
        if (expenseCategoriesData.value) {
            return;
        }

        isLoading.value = true;
        error.value = null;

        try {
            const { data, error: apiError } = await useAuthenticatedFetch<Category[] | null>('/category/all/expense');
            if (apiError.value) {
                error.value = apiError.value;
                console.error("Erreur lors de la récupération des catégories:", apiError.value);
            } else {
                expenseCategoriesData.value = data.value;
            }
        } catch (e) {
            error.value = e;
            console.error("Une erreur inattendue est survenue:", e);
        } finally {
            isLoading.value = false;
        }
    };

    return { expenseCategoriesData, mappedCategories, isLoading, error, fetchCategories };
});
