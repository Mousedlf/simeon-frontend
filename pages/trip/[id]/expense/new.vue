<script lang="ts" setup>

import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from "~/store/auth";
import { useRouter, useRoute } from 'vue-router';
import { useTripStore } from '~/store/trip';
import { useCurrenciesStore } from '~/store/currencies';
import {useExpenseCategoriesStore} from "~/store/expense-categories";

const name = ref<string | null>(null);
const amountLocalCurrency = ref<number | null>(null);
const currency = ref<number>(1);
const paidBy = ref<number | null>(null);
const divideWith = ref<number[]>([]);
const date = ref<string | null>(null);
const place = ref<string | null>(null);
const category = ref<number | null>(null);
const note = ref<string | null>(null);
const isPersonal = ref(false);
const paymentMethod = ref<string | null>(null);
const dayOfTrip = ref<number | null>(null);
const divide = ref<boolean>(false);

const toast = useToast();
const route = useRoute();
const router = useRouter();
const tripId = route.params.id as string;

const {user} = storeToRefs(useAuthStore())

const tripStore = useTripStore();
const { tripData, isLoading } = storeToRefs(tripStore);

const currenciesStore = useCurrenciesStore();
const { currenciesData } = storeToRefs(currenciesStore);

const expenseCategoryStore = useExpenseCategoriesStore();
const { mappedCategories, isLoading: expenseCategoriesLoading, error: expenseCategoriesError } = storeToRefs(expenseCategoryStore);

if (tripId && (!tripData.value || tripData.value.id !== tripId)) {
  tripStore.fetchTripData(tripId);
}

const tripParticipants = computed(() => {
  return tripData.value?.participants?.map(p => ({
    id: p.participant.id,
    label: p.participant.username,
    avatar: { src: 'https://avatars.githubusercontent.com/u/904724?v=4' }
  })) || [];
});

const isSoloTrip = computed(() => tripParticipants.value.length <= 1);

onMounted(async () => {
  await currenciesStore.fetchCurrencies();
  await expenseCategoryStore.fetchCategories();
});

const currencies = computed(() => {
  return currenciesData.value?.map(currency => ({
    label: `${currency.symbol} (${currency.name})`,
    value: currency.id,
  })) || [];
});

const daysOfTrip = computed(() => {
  return tripData.value?.daysOfTrip?.map(day => ({
    id: day.id,
    label: new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(day.date)),
    value: day.id,
  })) || [];
});


const handleSubmit = async () => {

  if (!amountLocalCurrency.value) {
    toast.add({
      title: "Le montant payé est requis.",
      color: 'error',
      duration: 5000
    })
    return;
  }

  if (isPersonal.value || isSoloTrip.value) {
    paidBy.value = user.value?.id || null;
    divideWith.value = [];
    divide.value = false;
  }

  const expenseData = {
    amountLocalCurrency: amountLocalCurrency.value,
    currency: currency.value.value,
    paidBy: paidBy.value,
    dividedWith: divideWith.value,
    date: date.value,
    place: place.value,
    category: category.value,
    note: note.value,
    paymentMethod: paymentMethod.value,
    personal: isPersonal.value,
    dayOfTrip: dayOfTrip.value.id,
    name: name.value,
    divide: divide.value,
  };

  console.log('expenseDAta', expenseData);

  try {
    const {data: resData, error: apiError} = await useAuthenticatedFetch(`/expense/new/trip/${tripId}`, {
      method: 'POST',
      body: expenseData,
    });

    if (apiError.value) {
      console.error("Erreur lors de l'ajout de la dépense.", apiError.value);
      toast.add({
        title: "Erreur lors de l'ajout de la dépense.",
        color: 'error',
        duration: 5000
      })
    } else {
      toast.add({
        title: 'Dépense ajoutée avec succès',
        color: 'success',
        duration: 5000
      })
      await router.push(`/trip/${tripId}`);
    }
  } catch (err) {
    console.error(err);
  }
};
</script>


<template>
  <UContainer class="py-6">
    <div class="mb-4">
      <UButton
          icon="i-lucide-arrow-left"
          label="Retour"
          variant="link"
          @click="$router.back()"
      />
    </div>
    <h1 class="text-xl font-semibold mb-6">Ajouter une dépense</h1>
    <div class="grid gap-12 md:grid-cols-2">

      <!-- Colonne gauche -->
      <div class="space-y-4">
        <UFormField label="Montant (par défaut : euro)" name="amount" required>
          <UButtonGroup class="border-2 border-primary-500 rounded-lg w-full">
            <UInput
                v-model="amountLocalCurrency"
                class="text-2xl font-semibold w-full"
                placeholder="0.00"
                size="xl"
                variant="none"
            >
            </UInput>

            <USelectMenu
                v-model="currency"
                :items="currencies"
                default-value="€"
                value-attribute="value"
                option-attribute="label"
                class="w-1/2"
                variant="none"/>
          </UButtonGroup>
        </UFormField>

        <UFormField label="Jour du voyage" name="dayOfTrip">
          <USelectMenu
              v-model="dayOfTrip"
              :items="daysOfTrip"
              placeholder="Sélectionner un jour"
              value-attribute="value"
              option-attribute="label"
              class="w-full"
          />
        </UFormField>


        <UFormField label="Nom de la dépense" name="name" >
          <UInput v-model="name" placeholder="Dîner au restaurant..." class="w-full" />
        </UFormField>

        <UFormField label="Moyen de payment" name="paymentMethod">
          <USelectMenu
              v-model="paymentMethod"
              :items="['Carte bancaire', 'Espèces', 'Virement']"
              class="w-full"
          />
        </UFormField>

        <UCheckbox
            v-if="!isSoloTrip"
            v-model="isPersonal"
            label="Dépense personnelle"
            name="isPersonal"
        />

        <UFormField v-if="!isPersonal && !isSoloTrip" label="Payé par" name="paidBy">
          <UInputMenu
              v-model="paidBy"
              :items="tripParticipants"
              class="w-full"
              delete-icon="i-lucide-trash"
          />
        </UFormField>

        <UCheckbox
            v-if="!isPersonal && !isSoloTrip"
            v-model="divide"
            label="Diviser la facture"
            name="divide"
        />

        <UFormField v-if="!isPersonal && !isSoloTrip && divide" label="Diviser facture avec" name="divide">
          <UInputMenu
              v-model="divideWith"
              :items="tripParticipants"
              class="w-full"
              delete-icon="i-lucide-trash"
              multiple
          />
        </UFormField>

      </div>

      <!-- Colonne droite -->
      <div class="space-y-4">
        <UFormField label="Catégorie">
          <div v-if="expenseCategoriesLoading" class="text-center text-gray-500">
            Chargement des catégories...
          </div>
          <div v-else-if="expenseCategoriesError">
            <p class="text-red-500">Erreur lors du chargement des catégories.</p>
          </div>
          <div v-else-if="mappedCategories && mappedCategories.length > 0" class="grid grid-cols-5 gap-2 border-blue-500">
            <UButton
                v-for="cat in mappedCategories"
                :key="cat.id"
                :variant="category === cat.id ? 'solid' : 'soft'"
                @click="category = cat.id"
                class="flex flex-col items-center justify-center p-2 h-20"
            >
              <Icon :name="cat.icon" class="w-6 h-6"/>
              <span class="text-xs mt-1 text-center">{{ cat.displayName }}</span>
            </UButton>
          </div>
        </UFormField>

        <UFormField label="Note">
          <UTextarea v-model="note" placeholder="Ajouter une note, appréciation, remarque..." class="w-full"/>
        </UFormField>
      </div>
    </div>

    <div class="mt-8 flex justify-end">
      <UButton
          class="w-full md:w-auto"
          icon="i-lucide-check-circle"
          label="Ajouter la dépense"
          size="lg"
          @click="handleSubmit"
      />
    </div>
  </UContainer>
</template>
