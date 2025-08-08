<script setup lang="ts">
import { categoryMap } from '~/utils/category-map';

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
  },
  sum: {
    type: Number,
  },
  category: {
    type: String,
    validator: (value) => {
      return ['transport', 'restaurant', 'food',
        'drinks', 'museum', 'activity', 'shopping',
        'shopping', 'cleaning', 'housing', 'flight', 'coffee'].includes(value);
    }
  },
})

const categoryInfo = computed(() => categoryMap[props.category] || { icon: '❓', name: 'Inconnu' })


</script>

<template>
  <div class="flex justify-between py border-b border-b-gray-400 py-1">
    <div class="inline-flex items-center ">
      <UAvatar
          :icon="categoryInfo.icon"
          size="md"
          v-if="type == 'expense'"
          class="mr-4"
      />

      <p v-if="type == 'expense'">{{ categoryInfo.name }} </p>
      <p v-else>{{ title }} </p>
    </div>

    <div class="inline-flex items-center">
      <UBadge
          v-if="type == 'document'"
          class="font-bold rounded-full mr-4">
        {{ categoryInfo.name }}
      </UBadge>

      <p v-if="type == 'expense'">{{ sum }} €</p>

      <UAvatar v-if="type == 'document'" icon="i-heroicons-arrow-up-on-square" size="md" />

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

</template>

<style scoped>

</style>