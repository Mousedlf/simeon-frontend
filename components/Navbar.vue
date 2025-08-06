<script setup lang="ts">

import {useAuthStore} from "~/store/auth";

const showDropdown = ref(false);
const showMobileMenu = ref(false);
const route = useRoute();

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
  if (showDropdown.value) {
    showMobileMenu.value = false;
  }
}

function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value;
  if (showMobileMenu.value) {
    showDropdown.value = false;
  }
}

function isActive(path: string): boolean {
  return route.path === path;
}

const defaultProfileImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCQ5uDxEKaeg-oV_AKOqwnTFoxR1gHUZ1EwQ&s';

</script>

<template>
  <nav class="container bg-white border-gray-200 mx-auto relative h-16">
    <div class="w-full flex flex-wrap items-center justify-between p-4">
      <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
        <Logo/>
      </a>

      <div class="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        <div class="flex items-center gap-4">
          <Button redirect="/trip/new"
                  label="Ajouter un voyage"
                  class="hidden md:block"
                  size="md"
          />

          <!-- Avatar -->
          <div class="relative">
            <button @click="toggleDropdown" type="button"
                    class="flex text-sm  rounded-full hover:ring-4 hover:ring-blue-300">
              <img class="w-8 h-8 rounded-full" :src="user?.image_src || defaultProfileImage" alt="Avatar">
            </button>

            <!-- Dropdown -->
            <div v-show="showDropdown"
                 class="absolute right-0 z-50 mt-2 w-56 md:w-48 origin-top-right rounded-md  py-1 shadow-lg bg-blue-300  focus:outline-none ">
              <div class="px-4 py-3">
                <span class="block md:text-sm text-gray-900">{{ user?.username || "@pseudonyme" }}</span>
                <span class="block md:text-sm text-gray-500 truncate">{{ user?.email || "mail@mail.com" }}</span>
              </div>
              <ul class="py-2">
                <USeparator/>
                <li>
                  <a href="/profile" class="block px-4 py-2 md:text-sm text-gray-700 hover:bg-blue-500 hover:text-white">
                    Mes informations
                  </a>
                </li>
                <li>
                  <a href="#"
                     class="block px-4 py-2 md:text-sm text-gray-700 hover:bg-blue-500 hover:text-white">Mes
                    documents officiels</a>
                </li>
                <li>
                  <a href="#"
                     class="block px-4 py-2 md:text-sm text-gray-700 hover:bg-blue-500 hover:text-white">Mon
                    prochain voyage</a>
                </li>
                <li>
                  <a href="#"
                     class="block px-4 py-2 md:text-sm text-gray-700 hover:bg-blue-500 hover:text-white">Mes
                    amis
                    <UBadge  color="neutral" variant="outline" size="sm" class="rounded-full">à venir</UBadge>
                  </a>
                </li>
                <li>
                  <a @click="authStore.logout()"
                     class="block px-4 py-2 md:text-sm text-gray-700 hover:bg-blue-500 hover:text-white cursor-pointer">
                    Déconnexion
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <!-- Menu mobile -->
          <button @click="toggleMobileMenu" type="button"
                  class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100">
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Navigation principale -->
      <div
          :class="[
              'md:flex md:w-auto md:order-1',
              'absolute top-16 left-0 right-0 md:relative md:top-0 ',
              'z-50 bg-white shadow-lg md:shadow-none',
              { 'hidden': !showMobileMenu }
          ]"
          id="navbar-user"
      >
        <ul class="flex flex-col font-medium p-10 md:p-0 bg-blue-300 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white text-center">
          <li>
            <a href="/"
               :class="['block py-2 px-3 rounded-sm transition-colors duration-200',
               isActive('/') ? 'text-blue-500 font-semibold' : 'text-gray-900 hover:text-blue-500'
               ]"
            >Mes voyages</a>
          </li>
          <li>
            <a href="/messenger"
               :class="['block py-2 px-3 rounded-sm transition-colors duration-200',
               isActive('/messenger') ? 'text-blue-500 font-semibold' : 'text-gray-900 hover:text-blue-500'
               ]"
            >Conversations
              <UChip :text="5" size="3xl"/>
            </a>
          </li>
          <li>
            <a href="#"
               class="block py-2 px-3 rounded-sm transition-colors duration-200"
            >Communauté
              <UBadge  color="neutral" variant="outline" size="sm" class="rounded-full">à venir</UBadge>
            </a>
          </li>

          <li class="md:hidden mt-4 pt-4 border-t border-gray-200">
            <h3>Envie de partir à l'aventure ? lala</h3>
            <Button redirect="/trip/new" label="Ajouter un voyage" class="block"/>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>

@media (max-width: 768px) {
  #navbar-user {
    transition: all 0.3s ease-in-out;
    transform: translateX(-100%);
  }
  #navbar-user:not(.hidden) {
    transform: translateX(0);
  }
}

</style>