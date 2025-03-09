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
  category: 'café',
  price: '5.00'
}, {
  category: 'musée',
  price: '9.00'
}, {
  category: 'restaurant',
  price: '15.00'
}, {
  category: 'café',
  price: '5.00'
},
]

const participants = [{
  name: "Thomas",
}, {
  name: "Thibo",
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

    <div class="w-full flex lg:flex-row lg:w-10/12 bg-white">
      <UTabs :items="tabs"
             :default-index="0"
             class="w-full lg:w-1/2 p-4 bg-white"
             variant="link"
             color="primary"
      >

        <template #itinerary="{ item }">
          <UTabs :items="days" :default-index="0"/>
          <p>itinéraire</p>
        </template>

        <template #expenses="{ item }">
          <UTabs :items="days" :default-index="0"/>
          <h3>Dernières dépenses</h3>
          <div class="" v-for="expense in expenses" :key="item.id">
            <div class="flex justify-between border-b">
              <p>{{ expense.category }}</p>
              <div class="flex">
                <p>{{ expense.price }}</p>
                <button id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots"
                        class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        type="button">
                  <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                       viewBox="0 0 4 15">
                    <path
                        d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
                  </svg>
                </button>

                <!-- Dropdown menu -->
                <div id="dropdownDots"
                     class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600">
                  <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                    <li>
                      <a href="#"
                         class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Modifier</a>
                    </li>
                    <li>
                      <a href="#"
                         class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Enlever</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #documents="{ item }">
          <UTabs :items="days" :default-index="0"/>
          <p>documents</p>
        </template>
      </UTabs>

      <div class="w-full lg:w-1/2 p-4 bg-gray-100 hidden lg:block">
        Carte
      </div>

    </div>
  </div>

</template>

<style scoped>


</style>

