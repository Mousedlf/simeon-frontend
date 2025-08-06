<script lang="ts" setup>
import {ref} from 'vue';
import {CalendarDate} from "@internationalized/date";
import type {Trip} from "~/types/trip";

const activePanel = ref('');
const route = useRoute();
const tripId = route.params.id;

function open(panel: 'map' | 'details') {
  if (activePanel.value === panel) {
    activePanel.value = ''; // Fermer le panel s'il est déjà ouvert
  } else {
    activePanel.value = panel; // Ouvrir le panel et fermer l'autre
  }
}

const value = ref({start: new CalendarDate(2024, 11, 26), end: new CalendarDate(2024, 11, 30)})
const trip = ref<Trip | null>(null);

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

const days = [{
  label: "26 Novembre",
  activitiesCount: "5"
}]

const expenses = [{
  category: 'coffee',
  price: '5.00'
}, {
  category: 'museum',
  price: '9.00'
}, {
  category: 'restaurant',
  price: '15.00'
}, {
  category: 'drinks',
  price: '5.00'
},
]

const documents = [{
  title: 'Réservation musée X',
  category: 'museum',
}, {
  title: 'Réservation parc X',
  category: 'museum',
}, {
  title: 'Bus 24837',
  category: 'transport',
}, {
  title: 'Vol FR-GR',
  category: 'flight',
},
]

const participants = [{
  name: "Thomas",
}, {
  name: "Thibo",
}
]

const stats = [{
  text: "Budget journalier",
  spent: 12,
  total: 50,
  progress: 24
}, {
  text: "Budget total",
  spent: 134,
  total: 1000,
  progress: 13
}
]

onMounted(() => {
  getTrip()
})

async function getTrip() {
  const { data: resData, error } = await useAuthenticatedFetch(`/trip/${tripId}`, {
    method: 'GET',
  })

  if (resData.value) {
    trip.value = resData.value as Trip;
  } else {
    console.error("Erreur de récupération des données du voyage :", error.value);
    trip.value = null;
  }

}

function addParticipant() {
}

</script>

<template>
  <div class="w-screen flex flex-col lg:flex-row h-screen ">

    <div class="p-2 bg-primary-500 lg:hidden">
      <div class="flex justify-between items-center">
        <h1>{{ trip?.name }}</h1>
        <button class="btn" @click="open('map')">
          Carte
        </button>
        <button @click="open('details')">
          Dots
        </button>
      </div>

      <div v-if="activePanel === 'details'" class="">
        <p>{{ trip?.description }}</p>
        <p>alaalla</p>
        <p>zjzzj</p>
      </div>

      <div v-if="activePanel === 'map'" class="">
        <div class="bg-gray-700">carte</div>
      </div>
    </div>

    <div class="w-screen h-full flex bg-white border-t border-t-gray-200">
      <UDrawer class="hidden lg:block" direction="left" :handle="false">
        <UButton
            variant="link"
            class="bg-primary-500 rounded-none h-full flex items-start justify-center pt-4"
            icon="i-lucide-chevron-right"
            aria-label="Ouvrir les infos du voyage"
        />

        <template #content>
          <div class="p-6 space-y-6 text-sm text-gray-800">
            <!-- Informations -->
            <div>
              <div class="flex justify-between items-center">
                <h1 class="text-xl font-semibold text-gray-900">{{ trip?.name || "pas de nom" }}</h1>
                <!-- Optional settings button could go here -->
              </div>
              <p class="text-gray-600 mt-1">{{ trip?.description || "pas de description" }}</p>
            </div>

            <!-- Calendrier -->
            <div>
              <h2 class="text-sm font-medium text-gray-700 mb-2">Dates du voyage</h2>
              <UCalendar
                  v-model="value"
                  :year-controls="false"
                  color="primary"
                  range
                  size="sm"
                  class="border border-blue-500 p-2"
                  week-starts-on="1.0"
              />
            </div>

            <!-- Recap jours -->
            <div>
              <h2 class="text-sm font-medium text-gray-700 mb-2">Résumé des jours</h2>
              <ul class="list-disc pl-5 space-y-1 text-gray-600">
                <li v-for="day in days" :key="day.label">
                  {{ day.label }} — {{ day.activitiesCount }} activité(s)
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
                    <p>kssksk</p>
                  </template>
                </UModal>
              </div>
              <ul class="space-y-1 text-gray-600 mb-2">
                <li v-for="participant in trip?.participants" :key="participant.name">
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
              <UTabs :default-index="0" :items="days" size="sm"/>

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
              <!--              <h3>Dépenses du ...</h3>-->
              <div v-for="expense in expenses" :key="item.id" class="">
                <DataLine
                    :category="expense.category"
                    :price="expense.price"
                    type="expense"
                />
              </div>
            </div>
            <div class="ml-10">
              <UModal
                  description="Manuellement en entrant toutes les données, ou assisté avec un préremplissage suite à la prise d'une photo."
                  title="Ajouter une dépense"

              >
                <Button label="Ajouter une dépense"/>

                <template #body>
                  <div class="flex flex-col justify-center">
                    <Button label="Manuellement" redirect="/trip/expense/new"/>
                    <USeparator label="ou"/>
                    <UModal title="Prendre une photo d'un reçu">
                      <UButton label="Photo d'un reçu" color="neutral" variant="subtle" />
                      <template #body>
                        <Placeholder class="h-48" />
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
              <div v-for="document in documents" :key="item.id" class="">
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

