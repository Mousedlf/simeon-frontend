<script lang="ts" setup>

import {useAuthStore} from "~/store/auth";
import { categories } from '~/utils/categories';

const amount = ref<number | null>(null);
const currency = ref<string>('€ (euro)');
const paidBy = ref<number | null>(null);
const divideWith = ref<string[]>([]);
// const date = ref<string | null>(null);
// const place = ref<string | null>(null);
const category = ref<string | null>(null);
// const note = ref<string | null>(null);
const isPersonal = ref(false);
const paymentMethod = ref<string | null>(null);

const toast = useToast();
const route = useRoute();
const tripId = route.params.id;
const router = useRouter();

const {user} = storeToRefs(useAuthStore())


const handleSubmit = async () => {

  if (!amount.value) {
    toast.add({
      title: "Le montant payé est requis.",
      color: 'error',
      duration: 5000
    })
    return;
  }

  if (isPersonal.value) {
    paidBy.value = user.value?.id || null;
    divideWith.value = [];
  }

  const expenseData = {
    sum: amount.value,
    // currency: currency.value,
    paidBy: paidBy.value,
    dividedWith: divideWith.value,
    // date: date.value,
    // place: place.value,
    // category: category.value,
    // note: note.value,
    paymentMethod: paymentMethod.value,
    personal: isPersonal.value,
  };

  try {
    const {data: resData, error: apiError} = await useAuthenticatedFetch(`/expense/new/trip/${tripId}`, {
      method: 'POST',
      body: expenseData,
    });

    if (apiError.value) {
      console.error("Erreur lors de l'ajout de la dépense.", apiError.value);
    } else {

      toast.add({
        title: 'Dépense ajoutée avec succès',
        description: resData.value,
        color: 'success',
        duration: 5000
      })
    }
    router.push(`/trip/${tripId}`);
  } catch (err) {
    console.error(err);
  }
};

// const route = useRoute();
// const tripId = route.params.id;

const selectDivideItems = ref(['Diviser', 'Ne pas diviser'])
const tripParticipants = ref([
  {
    label: 'benjamincanac',
    value: '1',
    avatar: {
      src: 'https://github.com/benjamincanac.png',
      alt: 'benjamincanac'
    }
  }
])
const currencies = ['€ (euro)', '$ (dollar)']


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
        <UFormField label="Montant" name="amount" required>
          <UButtonGroup class="border-2 border-primary-500 rounded-lg">
            <UInput
                v-model="amount"
                class="text-2xl font-semibold"
                placeholder="0.00"
                size="xl"
                variant="none"
            >
            </UInput>

            <USelectMenu
                v-model="currency"
                :items="currencies"
                default-value="€ (euro)"
                variant="none"/>
            <!-- value-attribute -->
          </UButtonGroup>
        </UFormField>

        <UCheckbox
            v-model="isPersonal"
            label="Dépense personnelle"
            name="isPersonal"
        />

        <UFormField label="Payé par" name="paidBy">
          <UInputMenu
              v-model="paidBy"
              :items="tripParticipants"
              class="w-full"
              delete-icon="i-lucide-trash"
          />
        </UFormField>

        <UFormField label="Diviser facture avec" name="divide">
          <UInputMenu
              v-model="divideWith"
              :items="tripParticipants"
              class="w-full"
              delete-icon="i-lucide-trash"
              multiple
          />
        </UFormField>

        <UFormField label="Moyen de payment" name="paymentMethod">
          <USelectMenu
              v-model="paymentMethod"
              :items="['Carte bancaire', 'Espèces', 'Virement']"
              class="w-full"
          />
        </UFormField>

        <!--        <UFormField label="Date" name="date">-->
        <!--          <UInput v-model="date" type="date"/>-->
        <!--        </UFormField>-->

        <!--        <UFormField label="Lieu" name="place">-->
        <!--          <UInput v-model="place" placeholder="ex. Auchan, Burger ..."/>-->
        <!--        </UFormField>-->
      </div>

      <!-- Colonne droite -->
      <div class="space-y-4">
        <UFormField label="Catégorie">
          <div class="grid grid-cols-5 gap-2 border-blue-500">
            <UButton
                v-for="cat in categories"
                :key="cat.name"
                :variant="category === cat.name ? 'solid' : 'soft'"
                @click="category = cat.name"
            >
              <Icon :name="cat.icon" class="w-6 h-6"/>
              <span class="text-sm">{{ cat.name }}</span>
            </UButton>

          </div>
        </UFormField>


        <UFormField label="Note">
          <UInput v-model="note" placeholder="Ajouter une note facultative..."/>
        </UFormField>
      </div>
    </div>

    <!-- soumission -->
    <div class="mt-8">
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


<style scoped>

</style>