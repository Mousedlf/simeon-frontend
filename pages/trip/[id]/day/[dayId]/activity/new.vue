<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTripStore } from '~/store/trip';
import { storeToRefs } from 'pinia';

const route = useRoute();
const tripId = route.params.id as string;
const dayId = route.params.dayId as string;

const toast = useToast();
const router = useRouter();

const tripStore = useTripStore();
const { tripData, isLoading } = storeToRefs(tripStore);

if (tripId && (!tripData.value || tripData.value.id !== tripId)) {
  tripStore.fetchTripData(tripId);
}

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

const selectedCategory = ref(null);

const formData = ref({
  name: '',
  address: '',
  category: null,
  longitude: null,
  latitude: null,
  note: '',
  dayOfTrip: dayId || null,
});

onMounted(() => {
  const storedPlace = sessionStorage.getItem('newTripActivityPlace');

  console.log(tripId);
  console.log(dayId);

  if (storedPlace) {
    const place = JSON.parse(storedPlace);

    formData.value.name = place.name;
    formData.value.address = place.address;
    formData.value.longitude = place.longitude;
    formData.value.latitude = place.latitude;
  }
});

const handleSubmit = async () => {
  formData.value.category = selectedCategory.value;
  sessionStorage.removeItem('newTripActivityPlace');

  const activityData = {
    name: formData.value.name,
    address: formData.value.address,
    category: formData.value.category,
    longitude: formData.value.longitude,
    latitude: formData.value.latitude,
    note: formData.value.note,
  };

  if (!formData.value.dayOfTrip) {
    toast.add({
      title: 'Veuillez sélectionner un jour de voyage',
      color: 'danger',
      duration: 5000,
    });
    return;
  }

  try {
    const { data: resData, error: apiError } = await useAuthenticatedFetch(`/activity/new/trip/${tripId}/day/${formData.value.dayOfTrip.value}`, {
      method: 'POST',
      body: activityData,
    });

    if (apiError.value) {
      console.error("Erreur lors de l'ajout de l'activité.", apiError.value);
      toast.add({
        title: 'Erreur lors de l\'ajout de l\'activité',
        color: 'danger',
        duration: 5000,
      });
    } else {
      toast.add({
        title: 'Activité ajoutée avec succès',
        color: 'success',
        duration: 5000,
      });
    }
    await router.push(`/trip/${tripId}`);
  } catch (err) {
    console.error(err);
    toast.add({
      title: 'Une erreur inattendue est survenue',
      color: 'danger',
      duration: 5000,
    });
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
    <h1 class="text-xl font-semibold mb-6">Ajouter une nouvelle activité</h1>
    <div class="grid gap-12 md:grid-cols-2">
      <UForm :state="formData" class="space-y-4" @submit.prevent="handleSubmit">
        <UFormField label="Nom" name="name">
          <UInput v-model="formData.name" class="w-full"/>
        </UFormField>
        <UFormField label="Adresse" name="address">
          <UInput v-model="formData.address" disabled class="w-full"/>
        </UFormField>
        <UFormField label="Note" name="note">
          <UTextarea v-model="formData.note" class="w-full"/>
        </UFormField>
        <UFormField label="Jour du voyage" name="dayOfTrip">
          <USelectMenu
              v-model="formData.dayOfTrip"
              :items="daysOfTrip"
              placeholder="Sélectionner un jour"
              value-attribute="value"
              option-attribute="label"
              class="w-full"
          />
        </UFormField>
        <input type="hidden" v-model="formData.longitude" />
        <input type="hidden" v-model="formData.latitude" />
      </UForm>

      <div class="space-y-4">
        <UFormField label="Catégorie">
          <div class="grid grid-cols-5 gap-2">
            <!--            <UButton
                            v-for="cat in useExpenseCategories"
                            :key="cat.name"
                            :variant="selectedCategory === cat.name ? 'solid' : 'soft'"
                            @click="selectedCategory = cat.name"
                        >
                          <UIcon :name="cat.icon" class="w-6 h-6"/>
                          <span class="text-sm">{{ cat.name }}</span>
                        </UButton>-->
          </div>
        </UFormField>
      </div>
    </div>

    <div class="mt-8">
      <UButton
          class="w-full md:w-auto"
          icon="i-lucide-check-circle"
          label="Enregistrer l'activité"
          size="lg"
          @click="handleSubmit"
      />
    </div>
  </UContainer>
</template>
