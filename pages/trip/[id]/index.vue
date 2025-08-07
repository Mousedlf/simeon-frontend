<script lang="ts" setup>
import {ref, watch} from 'vue';
import {CalendarDate} from "@internationalized/date";
import type {Trip} from "~/types/trip";
import type {Expense} from "~/types/expense";
import type { Profile } from '~/types/profile';

const activePanel = ref('');
const route = useRoute();
const tripId = route.params.id as string;

function open(panel: 'map' | 'details') {
  if (activePanel.value === panel) {
    activePanel.value = '';
  } else {
    activePanel.value = panel;
  }
}

const {data: tripData, error: tripError, refresh} = await useAuthenticatedFetch< Trip | null>(`/trip/${tripId}`);

const tripDays = ref<{ start: CalendarDate | null, end: CalendarDate | null }>({
  start: null,
  end: null,
});

if (tripError.value) {
  console.error('Erreur lors de la récupération du voyage:', tripError.value);
}


const {data: expensesData, error: expensesError} = await useAuthenticatedFetch(`/expense/all/trip/${tripId}`);
const commonExpenses = ref<Expense[]>(expensesData.value?.common.expenses as Expense[] || []);
const personalExpenses = ref<Expense[]>(expensesData.value?.personal.expenses as Expense[] || []);
const commonExpensesTotal = ref<number>(expensesData.value?.common.total || 0);
const personalExpensesTotal = ref<number>(expensesData.value?.personal.total || 0);
if (expensesError.value) {
  console.error('Erreur lors de la récupération des dépenses:', expensesError.value);
}

const tabs = [{
  label: 'Itinéraire',
  slot: 'itinerary',
}, {
  label: 'Dépenses',
  slot: 'expenses'
}, {
  label: 'Documents',
  slot: 'documents'
}]

const documents = [{
  title: 'Réservation musée X',
  category: 'museum',
}]

const stats = [{
  text: "Budget journalier",
  spent: 12,
  total: 50,
  progress: 24
}]


const {data: appUsers, error: appUsersError } = await useAuthenticatedFetch<Profile[] | null>('/user/all/public');
if (appUsersError.value) {
  console.error('Erreur lors de la récupération des utilisateurs:', appUsersError.value);
}
const formattedUsers = computed(() => {
  return appUsers.value.map(user => ({
    label: user.username,
    value: user.id,
    avatar: {
      src: user.imageSrc || `https://ui-avatars.com/api/?name=${user.username}&background=random`,
    }
  }));
});

const toast = useToast();

function addParticipant() {
}

const editTripFormState = reactive({
  name:  '',
  description: '',
});

async function editTripFormSubmit() {
  try {
    await useAuthenticatedFetch(`/trip/${tripId}/edit`, {
      method: 'PUT',
      body: editTripFormState,
    });
    await refresh();

    toast.add({
      title: 'Voyage mis à jour avec succès',
      color: 'success',
      duration: 5000
    })
  } catch (error) {
    toast.add({
      title: 'Erreur lors de la mise à jour du voyage',
      color: 'error',
      duration: 5000
    })
    console.error('Erreur lors de la mise à jour du voyage:', error);
  }
}

watch(tripData, (newTripData) => {
  if (newTripData) {
    editTripFormState.name = newTripData.name;
    editTripFormState.description = newTripData.description;

    console.log('État du formulaire mis à jour:', editTripFormState)

    if (newTripData.startDate && newTripData.endDate) {
      const start = new Date(newTripData.startDate);
      const end = new Date(newTripData.endDate);

      tripDays.value.start = new CalendarDate(
          start.getFullYear(),
          start.getMonth() + 1,
          start.getDate(),
      );

      tripDays.value.end = new CalendarDate(
          end.getFullYear(),
          end.getMonth() + 1,
          end.getDate(),
      );
    }
  }
}, { immediate: true });

const isEditModalOpen = ref(false);
watch(isEditModalOpen, (isOpen) => {
  if (isOpen && tripData.value) {
    editTripFormState.name = tripData.value.name;
    editTripFormState.description = tripData.value.description;
    console.log('Formulaire initialisé à l\'ouverture de la modal');
  }
});
</script>

<template>
  <div class="w-screen flex flex-col lg:flex-row h-screen ">

    <div class="p-2 bg-primary-500 lg:hidden">
      <div class="flex justify-between items-center">

        <h1>{{ tripData?.name }}</h1>
        <button class="btn" @click="open('map')">
          Carte
        </button>
        <button @click="open('details')">
          Dots
        </button>
      </div>

      <div v-if="activePanel === 'details'" class="">
        <p>{{ tripData?.description }}</p>
      </div>

      <div v-if="activePanel === 'map'" class="">
        <div class="bg-gray-700">carte</div>
      </div>
    </div>

    <div class="w-screen h-full flex bg-white border-t border-t-gray-200">
      <UDrawer :handle="false" class="hidden lg:block" direction="left">
        <UButton
            aria-label="Ouvrir les infos du voyage"
            class="bg-primary-500 rounded-none h-full flex items-start justify-center pt-4"
            icon="i-lucide-chevron-right"
            variant="link"
        />

        <template #content>
          <div class="p-6 space-y-6 text-sm text-gray-800">
            <!-- Informations -->
            <div>
              <div class="flex justify-between items-center">
                <h1 class="text-xl font-semibold text-gray-900">{{ tripData?.name || "pas de nom" }}</h1>
              </div>
              <p class="text-gray-600 mt-1">{{ tripData?.description || "pas de description" }}</p>
              <UModal
                  title="Modifier informations du voyage"
                  v-model="isEditModalOpen"
              >
                <UButton color="neutral" label="Editer informations" variant="subtle"     @click="isEditModalOpen = true"/>

                <template #body>
                  <UForm :state="editTripFormState" class="space-y-4" @submit="editTripFormSubmit">
                    <UFormField label="Nom du voyage" name="name">
                      <UInput v-model="editTripFormState.name"/>
                    </UFormField>

                    <UFormField label="Description" name="description">
                      <UTextarea v-model="editTripFormState.description"/>
                    </UFormField>

                    <div class="flex justify-end gap-2">
                      <UButton type="submit" label="Enregistrer" color="primary"/>
                    </div>
                  </UForm>
                </template>
              </UModal>
            </div>

            <!-- Calendrier -->
            <div>
              <h2 class="text-sm font-medium text-gray-700 mb-2">Dates du voyage</h2>
              <UCalendar
                  v-model="tripDays"
                  :year-controls="false"
                  class="border border-blue-500 p-2"
                  color="primary"
                  range
                  size="sm"
                  week-starts-on="1.0"
              />
            </div>

            <!-- Recap jours -->
            <div>
              <h2 class="text-sm font-medium text-gray-700 mb-2">Résumé des jours</h2>
              <ul class="list-disc pl-5 space-y-1 text-gray-600">
                <li v-for="day in tripData?.daysOfTrip" :key="day.label">
                  {{
                    new Intl.DateTimeFormat('fr-FR', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short'
                    }).format(new Date(day.date))
                  }} — <!--{{ day.activitiesCount }} activité(s)-->
                </li>
              </ul>
            </div>

            <!-- Participants -->
            <div>
              <div class="flex justify-between">
                <h2 class="text-sm font-medium text-gray-700 mb-2">Participants</h2>
                <UModal
                    title="Inviter un participant"
                >
                  <UButton color="neutral" label="Inviter un participant" variant="subtle"/>

                  <template #body>
                    <UFormField label="Qui voudrais-tu ajouter au voyage?" name="invitedParticipants">
                      <UInputMenu
                          v-model="invitedParticipants"
                          :items="formattedUsers"
                          class="w-full"
                          delete-icon="i-lucide-trash"
                          multiple
                      />
                    </UFormField>
                  </template>
                </UModal>
              </div>
              <ul class="space-y-1 text-gray-600 mb-2">
                <li v-for="participant in tripData?.participants" :key="participant.participant.id">
                  <UAvatar src="https://github.com/benjamincanac.png"/>
                  {{ participant.participant.username }}
                </li>
              </ul>
            </div>

          </div>
        </template>
      </UDrawer>

      <UTabs :default-index="1"
             :items="tabs"
             class="w-full h-full"
             color="primary"
             size="xl"
             variant="link"
      >

        <template #itinerary="{ item }"><!-- PAS LA BONNE HAUTEUR ! -->
          <div class="flex h-full overflow-x-auto">
            <div class="lg:w-1/2 p-4 h-full">
              <UTabs :default-index="0" :items="tripData?.daysOfTrip" size="sm"/>

              <ItineraryPlace
                  :open="true"
                  :openingHours="[]"
                  address="Adresse complete, 69000"
                  imageSrc="data:image/webp;base64,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"
                  name="Nom activité"
                  note=""
              />
              <div>
                <UModal
                    title="Ajouter une destination"
                >
                  <UButton label="Ajouter une destination" variant="link"/>

                  <template #body>
                  </template>
                </UModal>
              </div>
              <ItineraryPlace
                  :open="true"
                  :openingHours="[]"
                  address="Adresse complete, 69000"
                  imageSrc="data:image/webp;base64,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"
                  name="Nom activité"
                  note="super cool"
              />
            </div>
            <div class="h-full lg:w-1/2 bg-yellow-300 hidden lg:block ">
              <Map/>
            </div>
          </div>

        </template>

        <template #expenses="{ item }">

          <div class="flex">
            <div class="w-full h-full lg:w-1/2 p-4 ">
              <h3 class="text-lg font-semibold mb-2">Dépenses communes</h3>
              <div v-if="commonExpenses && commonExpenses.length > 0">
                <div v-for="expense in commonExpenses" :key="expense.id" class="">
                  <DataLine
                      :category="expense.category"
                      :sum="expense.sum"
                      type="expense"
                  />
                </div>
              </div>
              <div v-else class="text-gray-500">Pas de dépenses communes</div>

              <h3 class="text-lg font-semibold mt-6 mb-2">Dépenses personnelles</h3>
              <div v-if="personalExpenses && personalExpenses.length > 0">
                <div v-for="expense in personalExpenses" :key="expense.id" class="">
                  <DataLine
                      :category="expense.category"
                      :sum="expense.sum"
                      type="expense"
                  />
                </div>
              </div>
              <div v-else class="text-gray-500">Pas de dépenses personnelles</div>
            </div>
            <div class="ml-10">
              <UModal
                  description="Manuellement en entrant toutes les données, ou assisté avec un préremplissage suite à la prise d'une photo."
                  title="Ajouter une dépense"

              >
                <Button label="Ajouter une dépense"/>

                <template #body>
                  <div class="flex flex-col justify-center">
                    <Button :redirect="`/trip/${tripId}/expense/new`" label="Manuellement"/>
                    <USeparator label="ou"/>
                    <UModal title="Prendre une photo d'un reçu">
                      <UButton color="neutral" label="Photo d'un reçu" variant="subtle"/>
                      <template #body>
                        <Placeholder class="h-48"/>
                      </template>
                    </UModal>
                  </div>


                </template>
              </UModal>
              <div v-for="stat in stats" class="">
                <DataBox
                    :progress="stat.progress"
                    :spent="stat.spent"
                    :text="stat.text"
                    :total="stat.total"
                />
              </div>
            </div>


          </div>
        </template>

        <template #documents="{ item }">

          <div class="flex">
            <div class="w-full h-full lg:w-1/2 p-4 ">
              <div v-for="document in documents" :key="document.id" class="">
                <DataLine
                    :category="document.category"
                    :title="document.title"
                    type="document"
                />
              </div>
            </div>
            <UModal
                description="Stocke tes réservations ..."
                title="Ajouter un document"
            >
              <Button label="Ajouter un document"/>

              <template #body>


                <UForm class="space-y-4 w-96" @submit="">
                  <UFormField label="Nom du document" name="name">
                    <UInput/>
                  </UFormField>
                  <!-- categorie -->
                  <!-- lié a evenemement ? -->
                  <UFormField description="JPG, GIF or PNG. 2MB Max." label="Image" name="image">
                    <UFileUpload class="w-96 min-h-48"
                                 color="neutral" description="formats acceptés : kkjxdv"
                                 dropzone="true" label="Choisi ou dépose un document"/> <!-- accept-->
                  </UFormField>

                  <UButton color="neutral" label="Valider" type="submit"/>
                </UForm>


              </template>
            </UModal>

          </div>

          <div></div>

        </template>
      </UTabs>
    </div>
  </div>

</template>

<style scoped>


</style>

