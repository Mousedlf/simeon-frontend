<script setup lang="ts">

import {useAuthStore} from "~/store/auth";

const authStore = useAuthStore()
const { authenticated } = storeToRefs(authStore);

const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="bg-blue-800 text-gray-300 py-8 px-4">

    <div class="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
      <div class="text-center md:text-left">
        <p>&copy; {{ currentYear }} Simeon. Tous droits réservés.</p>
      </div>

      <div class="flex space-x-6 text-sm">
        <a v-if="authenticated" href="/index" class="hover:text-white transition-colors duration-200">Accueil</a>
        <a v-if="!authenticated" href="/login" class="hover:text-white transition-colors duration-200">Login</a>
        <a href="/about" class="hover:text-white transition-colors duration-200">À propos</a>
      </div>
    </div>
  </footer>
</template>