<script setup lang="ts">
import {ref} from 'vue';
import {CalendarDate} from "@internationalized/date";

const activePanel = ref('');

function open(panel: 'map' | 'details') {
  if (activePanel.value === panel) {
    activePanel.value = ''; // Fermer le panel s'il est déjà ouvert
  } else {
    activePanel.value = panel; // Ouvrir le panel et fermer l'autre
  }
}

const value = ref({ start: new CalendarDate(2024, 11, 26), end: new CalendarDate(2024, 11, 30) })


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
}, {
  label: "27 Novembre",
  activitiesCount: "3"
}, {
  label: "28 Novembre",
  activitiesCount: "4"
}, {
  label: "29 Novembre",
  activitiesCount: "7"
}, {
  label: "30 Novembre",
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

</script>

<template>
  <div class="mx-auto flex flex-col lg:flex-row h-screen">

    <div class="w-full lg:w-2/12 p-4 bg-gray-100 md:block">
      <div class="lg:hidden">
        <div class="flex justify-between items-center">
          <h1>Lyon</h1>
          <button @click="open('map')" class="btn">
            Carte
          </button>
          <button @click="open('details')">
            Dots
          </button>
        </div>

        <div v-if="activePanel === 'details'" class="">
          <p>Petite description en quelques mots si tu en as envie</p>
          <p>alaalla</p>
        </div>

        <div v-if="activePanel === 'map'" class="">
          <div class="bg-gray-700 p-4">carte</div>
        </div>
      </div>

      <div class="hidden lg:block ">
        <div class="pb-8">
          <div class="flex justify-between">
            <h1 class="">Lyon</h1>
            <button id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots"
                    class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900   hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    type="button">
              <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                   viewBox="0 0 4 15">
                <path
                    d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
              </svg>
            </button>
          </div>
          <p>Petite description en quelques mots si tu en as envie</p>

        </div>

        <UCalendar range v-model="value" week-starts-on="1.0"/>

        <h3>Recap des jours</h3>
        <ul v-for="day in days"
            class="list-disc pl-4"
        >
          <li>{{ day.label }} : {{ day.activitiesCount }} activités</li>
        </ul>

        <h3>Participants</h3>
        <ul v-for="participant in participants"
            class="list-disc pl-4"
        >
          <li>{{ participant.name }}</li>
        </ul>

      </div>
    </div>

    <div class="w-full flex lg:flex-row lg:w-10/12 md:block bg-green-600 border-t border-t-gray-200">
      <UTabs :items="tabs"
             :default-index="0"
             variant="link"
             color="primary"
             class="bg-red-700"
      > <!-- PAS LA BONNE HAUTEUR ! -->

        <template #itinerary="{ item }">
          <div class="flex bg-purple-500">
            <div class="lg:w-1/2 p-4">
              <UTabs :items="days" :default-index="0" size="sm"/>
              <h3>itinéraire</h3>
            </div>

            <div class="w-full lg:w-1/2 bg-yellow-300 hidden lg:block">
              Carte
            </div>
          </div>

        </template>

        <template #expenses="{ item }">

          <div class="flex">
            <div class="w-full h-full lg:w-1/2 p-4 ">
              <UTabs :items="days" :default-index="0"/>
              <h3>Dernières dépenses</h3>
              <div class="" v-for="expense in expenses" :key="item.id">
                <DataLine
                    type="expense"
                    :category="expense.category"
                    :price="expense.price"
                />
              </div>
            </div>
            <div class="mx-auto flex flex-col bg-amber-300" v-for="stat in stats">
              <DataBox
                  :text="stat.text"
                  :spent="stat.spent"
                  :total="stat.total"
                  :progress="stat.progress"
              />

            </div>

          </div>
        </template>

        <template #documents="{ item }">

          <div class="flex">
            <div class="w-full h-full lg:w-1/2 p-4 ">
              <UTabs :items="days" :default-index="0"/>
              <h3>Documents</h3>
              <div class="" v-for="document in documents" :key="item.id">
                <DataLine
                    type="document"
                    :title="document.title"
                    :category="document.category"
                />
              </div>
            </div>
          </div>

          <div></div>

        </template>
      </UTabs>
    </div>
  </div>

</template>

<style scoped>


</style>

