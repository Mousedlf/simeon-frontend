<script lang="ts" setup>
import {ref, watch, onMounted, computed, reactive} from 'vue';
import {CalendarDate} from "@internationalized/date";
import type {Expense} from "~/types/expense";
import type {UserProfile} from '~/types/user-profile';
import { useTripStore } from '~/store/trip';
import { storeToRefs } from 'pinia';
import {useExpenseCategoriesStore} from "~/store/expense-categories";

const activePanel = ref('');
const route = useRoute();
const tripId = route.params.id as string;
const category = ref<string | null>(null);
const activeTab = ref(0);

const isInviteModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isEditDatesModalOpen = ref(false);

const roles = [
  { label: 'Viewer', value: 'viewer', statusId: 1 },
  { label: 'Editor', value: 'editor', statusId: 2 },
];

function open(panel: 'map' | 'details') {
  if (activePanel.value === panel) {
    activePanel.value = '';
  } else {
    activePanel.value = panel;
  }
}

const tripStore = useTripStore();
const { tripData, isLoading, error: tripError } = storeToRefs(tripStore);

watch(() => route.params.id, (newTripId) => {
  if (newTripId) {
    tripStore.fetchTripData(newTripId as string);
  }
}, { immediate: true });


const { data: expensesData, error: expensesError } = await useAuthenticatedFetch(`/expense/all/trip/${tripId}`);
const commonExpenses = ref<Expense[]>([]);
const personalExpenses = ref<Expense[]>([]);

watch(expensesData, (newData) => {
  if (newData) {
    commonExpenses.value = newData.common.expenses as Expense[] || [];
    personalExpenses.value = newData.personal.expenses as Expense[] || [];
  }
}, { immediate: true });

const expenseCategoryStore = useExpenseCategoriesStore();

onMounted(async () => {
  await expenseCategoryStore.fetchCategories();
});

const mappedCommonExpenses = computed(() => {
  if (!expenseCategoryStore.mappedCategories) {
    return [];
  }
  return commonExpenses.value.map(expense => {
    const category = expenseCategoryStore.mappedCategories.find(c => c.id === expense.category);
    return {
      ...expense,
      categoryName: category?.displayName || 'Sans catégorie',
      categoryIcon: category?.icon || 'i-heroicons-tag-20-solid',
    };
  });
});

const daysOfTripTabs = computed(() => {
  if (!tripData.value || !tripData.value.daysOfTrip) {
    return [];
  }
  return tripData.value.daysOfTrip.map(day => {
    const date = new Date(day.date);
    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    }).format(date);
    return {
      label: formattedDate,
      key: day.id,
      activities: day.activities
    };
  });
});

const allTripActivities = computed(() => {
  if (!tripData.value || !tripData.value.daysOfTrip) {
    return [];
  }
  return tripData.value.daysOfTrip.flatMap(day => day.activities.map(activity => ({
    ...activity,
    dayId: day.id
  })));
});

const activeDayId = computed(() => {
  if (!daysOfTripTabs.value || daysOfTripTabs.value.length === 0) {
    return null;
  }
  return daysOfTripTabs.value[activeTab.value]?.key;
});

const tripDays = ref<{ start: CalendarDate | null, end: CalendarDate | null }>({
  start: null,
  end: null,
});

if (tripError.value) {
  console.error('Erreur lors de la récupération du voyage:', tripError.value);
}

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


const {data: appUsers, error: appUsersError} = await useAuthenticatedFetch<UserProfile[] | null>('/user/all/public');
if (appUsersError.value) {
  console.error('Erreur lors de la récupération des utilisateurs:', appUsersError.value);
}
const formattedUsers = computed(() => {
  if (!appUsers.value) return [];
  return appUsers.value.map(user => ({
    label: user.username,
    value: user.id,
    avatar: {
      src: user.imageSrc || `https://ui-avatars.com/api/?name=${user.username}&background=random`,
    }
  }));
});

const toast = useToast();

const inviteFormState = reactive({
  message: '',
  invitedUsers: [],
  selectedRole: 'viewer',
});

const handleInvite = async () => {
  const selectedRoleObject = roles.find(role => role.value === inviteFormState.selectedRole);
  if (!selectedRoleObject) {
    toast.add({
      title: 'Rôle invalide.',
      color: 'error' }
    );
    return;
  }

  const people = inviteFormState.invitedUsers.map(userId => ({
    userId: userId.value,
    statusId: selectedRoleObject.statusId,
  }));

  const body = {
    message: inviteFormState.message,
    people: people,
  };

  console.log(body)

  try {
    await useAuthenticatedFetch(`/trip/${tripId}/add-people`, {
      method: 'POST',
      body: body,
    });

    toast.add({
      title: 'Invitation(s) envoyée(s) avec succès !',
      color: 'success'
    });

    isInviteModalOpen.value = false;
    inviteFormState.message = '';
    inviteFormState.invitedUsers = [];
    inviteFormState.selectedRole = 'viewer';

  } catch (e) {
    console.error(e);

    toast.add({
      title: 'Erreur lors de l\'envoi des invitations.',
      color: 'error'
    });
  }
};

const editTripFormState = reactive({
  name: '',
  description: '',
});

const editTripDatesFormState = reactive({
  startDate: '',
  endDate: '',
});


async function editTripFormSubmit() {
  try {
    await useAuthenticatedFetch(`/trip/${tripId}/edit`, {
      method: 'PUT',
      body: editTripFormState,
    });
    await tripStore.fetchTripData(tripId);
    isEditModalOpen.value = false;

    toast.add({
      title: 'Voyage mis à jour avec succès',
      color: 'success',
      duration: 5000
    });
  } catch (error) {
    toast.add({
      title: 'Erreur lors de la mise à jour du voyage',
      color: 'error',
      duration: 5000
    });
    console.error('Erreur lors de la mise à jour du voyage:', error);
  }
}

async function editTripDatesFormSubmit() {
  try {
    await useAuthenticatedFetch(`/trip/${tripId}/edit-dates`, {
      method: 'PUT',
      body: editTripDatesFormState,
    });
    await tripStore.fetchTripData(tripId);
    isEditDatesModalOpen.value = false;

    toast.add({
      title: 'Dates du voyage mises à jour avec succès',
      color: 'success',
      duration: 5000
    });
  } catch (error) {
    toast.add({
      title: 'Erreur lors de la mise à jour des jours du voyage',
      color: 'error',
      duration: 5000
    });
    console.error('Erreur lors de la mise à jour des jours du voyage:', error);
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
}, {immediate: true});

watch(isEditModalOpen, (isOpen) => {
  if (isOpen && tripData.value) {
    editTripFormState.name = tripData.value?.name;
    editTripFormState.description = tripData.value?.description;
    console.log('Formulaire initialisé à l\'ouverture de la modal');
  }
});

const handleFileUploadError = (error: Error) => {
  if (error.message.includes('size')) {
    toast.add({
      title: 'Fichier trop volumineux',
      description: 'La taille du fichier ne doit pas dépasser 2 Mo.',
      color: 'error',
      icon: 'i-heroicons-exclamation-triangle-20-solid',
      duration: 5000,
    });
  } else {
    toast.add({
      title: 'Erreur de téléchargement',
      description: error.message,
      color: 'error',
      icon: 'i-heroicons-exclamation-triangle-20-solid',
      duration: 5000,
    });
  }
};

const activitiesForActiveDay = computed(() => {
  if (!tripData.value || !tripData.value.daysOfTrip) {
    return [];
  }
  const activeDay = tripData.value.daysOfTrip[activeTab.value];
  return activeDay ? activeDay.activities : [];
});
</script>

<template>
  <div class="w-screen flex flex-col lg:flex-row h-screen ">

    <div v-if="isLoading" class="p-4 flex items-center justify-center w-full h-full">
      <p>Chargement du voyage...</p>
    </div>
    <div v-else-if="tripError" class="p-4 flex items-center justify-center w-full h-full text-red-500">
      <p>Erreur lors du chargement du voyage : {{ tripError.message }}</p>
    </div>

    <div v-else class="w-screen flex flex-col lg:flex-row h-screen">
      <!-- -->
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
            <div class="p-6 space-y-6 overflow-scroll text-gray-800">
              <!-- Informations -->
              <UModal
                  v-model="isEditModalOpen"
                  title="Modifier informations du voyage"
              >
                <UButton
                    color="neutral"
                    icon="i-lucide-pencil"
                    variant="subtle"
                    @click="isEditModalOpen = true"/>

                <template #body>
                  <UForm :state="editTripFormState" class="space-y-4" @submit="editTripFormSubmit">
                    <UFormField label="Nom du voyage" name="name" >
                      <UInput v-model="editTripFormState.name" class="w-full"/>
                    </UFormField>

                    <UFormField label="Description" name="description">
                      <UTextarea v-model="editTripFormState.description" class="w-full"/>
                    </UFormField>

                    <div class="flex justify-end gap-2">
                      <UButton color="primary" label="Enregistrer" type="submit"/>
                    </div>
                  </UForm>
                </template>
              </UModal>
              <div>
                <div class="flex justify-between items-center">
                  <h1 class="text-xl font-semibold text-gray-900">{{ tripData?.name || "pas de nom" }}</h1>
                </div>
                <p class="text-gray-600 mt-1">{{ tripData?.description || "pas de description" }}</p>
              </div>

              <!-- Calendrier -->
              <div>
                <div class="flex justify-between">
                  <UModal
                      v-model="isEditDatesModalOpen"
                      title="Modifier des dates du voyage"
                  >
                    <UButton
                        color="neutral"
                        icon="i-lucide-pencil"
                        variant="subtle"
                        @click="isEditDatesModalOpen = true"/>

                    <template #body>
                      <UForm :state="editTripDatesFormState" class="space-y-4" @submit="editTripDatesFormSubmit">

                        <UFormField label="Date de début" name="startDate" required>
                          <UInput v-model="editTripDatesFormState.startDate" type="date"  />
                        </UFormField>

                        <UFormField label="Date de fin" name="endDate" required>
                          <UInput v-model="editTripDatesFormState.endDate" type="date" />
                        </UFormField>

                        <div class="flex justify-end gap-2">
                          <UButton color="primary" label="Enregistrer" type="submit"/>
                        </div>
                      </UForm>
                    </template>
                  </UModal>
                </div>
                <UCalendar
                    v-model="tripDays"
                    :year-controls="false"
                    class="border border-blue-500 p-2 rounded-sm"
                    color="primary"
                    range
                    size="sm"
                    week-starts-on="1.0"
                />
              </div>

              <!--!&#45;&#45; Recap jours &ndash;&gt;-->
              <!--<div>
                <h2 class="text-sm font-medium text-gray-700 mb-2">Résumé des jours</h2>
                <ul class="list-disc pl-5 space-y-1 text-gray-600">
                  <li v-for="day in tripData?.daysOfTrip" :key="day.label">
                    {{
                      new Intl.DateTimeFormat('fr-FR', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      }).format(new Date(day.date))
                    }} — &lt;!&ndash;{{ day.activitiesCount }} activité(s)&ndash;&gt;
                  </li>
                </ul>
              </div>-->

              <!-- Participants -->
              <div>
                <div class="flex justify-between">
                  <h2 class="text-sm font-medium text-gray-700 mb-2">Participants</h2>
                  <UModal
                      v-model="isInviteModalOpen"
                      title="Inviter des participants"
                  >
                    <UButton
                        color="neutral"
                        icon="i-lucide-user-plus"
                        variant="subtle"
                        @click="isInviteModalOpen = true"
                    />
                    <template #body>
                      <UForm :state="inviteFormState" @submit.prevent="handleInvite" class="space-y-4 p-4">
                        <UFormField label="Qui voudrais-tu ajouter au voyage?" name="invitedUsers">
                          <UInputMenu
                              v-model="inviteFormState.invitedUsers"
                              :items="formattedUsers"
                              class="w-full"
                              delete-icon="i-lucide-trash"
                              multiple
                          />
                        </UFormField>
                        <UFormField label="Quel rôle assigner ?">
                          <USelect
                              v-model="inviteFormState.selectedRole"
                              :items="roles"
                              class="w-48"
                          />
                        </UFormField>
                        <UFormField label="Message" name="message">
                          <UTextarea v-model="inviteFormState.message" class="w-full"/>
                        </UFormField>
                        <div class="flex justify-end gap-2">
                          <UButton color="primary" label="Envoyer" type="submit"/>
                        </div>
                      </UForm>
                    </template>
                  </UModal>
                </div>
                <ul class="space-y-1 text-gray-600 mb-2">
                  <li v-for="participant in tripData?.participants" :key="participant.participant.id">
                    <UAvatar src="https://github.com/benjamincanac.png"/> <!-- ajouter image dans profil? -->
                    {{ participant.participant.username }} ({{ participant.role }})
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
              <div class="lg:w-1/2 p-4 min-h-[83vh] h-full">
                <UTabs v-model="activeTab" :default-index="0" :items="daysOfTripTabs" size="sm"/>
                <div v-if="activitiesForActiveDay.length > 0">
                  <div v-for="activity in activitiesForActiveDay" :key="activity.id" class="">
                    <TripActivity
                        :openingHours="[]"
                        :address="activity.address"
                        :name="activity.name"
                        :note="activity.note"
                    />                  <!-- :image-->

                  </div>
                </div>

                <div v-else class="text-gray-500 mt-4 text-center">
                  Aucune activité de prévue pour ce jour.
                </div>
              </div>
              <div class=" lg:w-1/2 hidden lg:block bg-gray-2
              00 ">
                <Map
                    :places="allTripActivities"
                    :active-day-id="activeDayId"
                    :trip-id="tripId"
                />
              </div>
            </div>

          </template>

          <template #expenses="{ item }">

            <div class="flex">
              <div class="w-full h-full lg:w-1/2 p-4 ">
                <h3 class="text-lg font-semibold mb-2">Dépenses communes</h3>
                <div v-if="!expenseCategoryStore.isLoading && mappedCommonExpenses && mappedCommonExpenses.length > 0">
                  <div v-for="expense in mappedCommonExpenses" :key="expense.id" class="">
                    <Expense
                        :name="expense.name"
                        :amount-local-currency="expense.amountLocalCurrency"
                        :amount-euro="expense.amountEuro"
                        :currency="expense.currency"
                        :category-name="expense.categoryName"
                        :category-icon="expense.categoryIcon"
                        :paid-by="expense.paidBy"
                        :divided-with="expense.dividedWith"
                        :day-of-trip="expense.dayOfTrip"
                        :note="expense.note"
                        :personal="expense.personal"
                        :divide="expense.divide"
                    />
                  </div>

                </div>
                <div v-else-if="expenseCategoryStore.isLoading" class="text-gray-500">Chargement des dépenses...</div>
                <div v-else class="text-gray-500">Pas de dépenses communes</div>

                <h3 class="text-lg font-semibold mt-6 mb-2">Dépenses personnelles</h3>
                <div v-if="personalExpenses && personalExpenses.length > 0">
                  <div v-for="expense in personalExpenses" :key="expense.id" class="">
                    <Expense
                        :name="expense.name"
                        :amount-local-currency="expense.amountLocalCurrency"
                        :amount-euro="expense.amountEuro"
                        :currency="expense.currency"
                        :category-name="expense.categoryName"
                        :category-icon="expense.categoryIcon"
                        :paid-by="expense.paidBy"
                        :divided-with="expense.dividedWith"
                        :day-of-trip="expense.dayOfTrip"
                        :note="expense.note"
                        :personal="expense.personal"
                        :divide="expense.divide"
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
                  <UButton label="Ajouter une dépense"/>

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

                  <UForm class="space-y-4 w-full" @submit="">
                    <UFormField class="w-full" label="Nom du document" name="name">
                      <UInput class="w-full"/>
                    </UFormField>
                    <UFormField label="Catégorie">
                      <div class="grid grid-cols-4 gap-2 border-blue-500">
                        <UButton
                            v-for="cat in useExpenseCategories"
                            :key="cat.name"
                            :variant="category === cat.name ? 'solid' : 'soft'"
                            @click="category = cat.name"
                        >
                          <Icon :name="cat.icon" class="w-6 h-6"/>
                          <span class="text-sm">{{ cat.name }}</span>
                        </UButton>
                      </div>
                    </UFormField>
                    <!-- lier a evenemement/activité ?  -->
                    <!-- lier a jour de voyage  -->
                    <UFormField label="Document" name="document">
                      <UFileUpload
                          :description="`Formats acceptés : PDF, JPG, JPEG, PNG, GIF. Taille maximale : 2 Mo`"
                          :max-size-kb="2048"
                          accept=".pdf, .jpg, .jpeg, .png"
                          class="w-full min-h-48"
                          color="neutral"
                          label="Choisis ou dépose un document"
                          @error="handleFileUploadError"
                      />
                      <!-- taille max? -->
                    </UFormField>

                    <UButton color="neutral" label="Valider" type="submit"/>
                  </UForm>


                </template>
              </UModal>

            </div>

            <div></div>
            <div></div>

          </template>
        </UTabs>
      </div>
    </div>
  </div>
</template>
