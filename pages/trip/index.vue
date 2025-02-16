<script setup lang="ts">
import {ref} from 'vue';

const activePanel = ref('');

function open(panel: 'map' | 'details') {
  if (activePanel.value === panel) {
    activePanel.value = ''; // Fermer le panel s'il est déjà ouvert
  } else {
    activePanel.value = panel; // Ouvrir le panel et fermer l'autre
  }
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

const days = [{
  label: "26 Novembre"
}, {
  label: "27 Novembre",
}, {
  label: "28 Novembre",
}, {
  label: "29 Novembre",
}, {
  label: "30 Novembre",
}]
</script>

<template>
  <div class="mx-auto flex flex-col md:flex-row h-screen">

    <!-- Première colonne -->
    <div class="w-full lg:w-2/12 p-4 bg-gray-100 md:block">
      <div class="md:hidden">
        <div class="flex justify-between items-center">
          <h1>Nom du voyage</h1>
          <button @click="open('map')" class="btn">
            Carte
          </button>
          <button @click="open('details')">
            Dots
          </button>
        </div>

        <div v-if="activePanel === 'details'" class="">
          <p>Petite description en quelques mots si tu en as envie</p>

          <div class="bg-gray-700 p-4">calendrier</div>

          <h3>Recap des jours</h3>
          <ul>
            <li>Mardi: 5 activités</li>
            <li>Mardi: 5 activités</li>
            <li>Mardi: 5 activités</li>
            <li>Mardi: 5 activités</li>
          </ul>

          <h3>Participants</h3>
          <ul>
            <li>juste toi :)</li>
          </ul>
        </div>

        <div v-if="activePanel === 'map'" class="">
          <div class="bg-gray-700 p-4">carte</div>
        </div>
      </div>

      <div class="hidden md:block">
        <h1>Nom du voyage</h1>
        <p>Petite description en quelques mots si tu en as envie</p>
        <div class="bg-gray-700 p-4">calendrier</div>
        <h3>Recap des jours</h3>
        <ul>
          <li>Mardi: 5 activités</li>
          <li>Mardi: 5 activités</li>
          <li>Mardi: 5 activités</li>
          <li>Mardi: 5 activités</li>
        </ul>
        <h3>Participants</h3>
        <ul>
          <li>juste toi :)</li>
        </ul>
      </div>


    </div>

    <!-- Deuxième colonne -->
    <div class="w-full lg:w-10/12 p-4 bg-white">
      <UTabs :items="tabs"
             :default-index="0"
             class="w-full lg:w-1/2 p-4 bg-white"
      >
        <template #itinerary="{ item }">
          <UTabs :items="days" :default-index="0"/>
          <p>itinéraire</p>
        </template>

        <template #expenses="{ item }">
          <UTabs :items="days" :default-index="0"/>
          <h3>Dernières dépenses</h3>
        </template>

        <template #documents="{ item }">
          <UTabs :items="days" :default-index="0"/>
          <p>documents</p>
        </template>
      </UTabs>


      <div class="w-full lg:w-1/2 p-4 bg-gray-100 :hidden lg:block">
        Carte
      </div>

    </div>


  </div>

</template>

<style scoped>


</style>

