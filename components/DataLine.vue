<script setup lang="ts">

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  note: {
    type: String,
    default: '',
  },
  amountLocalCurrency: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: '',
  },
  amountEuro: {
    type: Number,
    default: 0,
  },
  categoryName: {
    type: String,
    default: 'Inconnu',
  },
  categoryIcon: {
    type: String,
    default: 'i-heroicons-question-mark-circle-20-solid',
  },
});
</script>

<template>
  <div class="flex justify-between border-b border-b-gray-400 py-2 items-center">
    <div class="inline-flex items-center space-x-4">
      <UAvatar
          v-if="props.type === 'expense'"
          :icon="props.categoryIcon"
          size="md"
          class="flex-shrink-0"
      />
      <UAvatar
          v-if="props.type === 'document'"
          icon="i-heroicons-paper-clip"
          size="md"
          class="flex-shrink-0"
      />

      <div>
        <p class="font-medium text-gray-900">{{ props.title }}</p>
        <UBadge v-if="props.type === 'document'" color="white" class="mt-1">
          {{ props.categoryName }}
        </UBadge>
      </div>
    </div>

    <div class="inline-flex items-center space-x-4">
      <p v-if="props.type === 'expense'" class="font-semibold text-gray-700">{{ props.sum }} €</p>

      <UAvatar v-if="props.type === 'document'" icon="i-heroicons-arrow-down-tray" size="md" />

      <button
          id="dropdownMenuIconButton"
          data-dropdown-toggle="dropdownDots"
          class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          type="button"
      >
        <svg
            class="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 4 15"
        >
          <path
              d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
          />
        </svg>
      </button>
      <!-- Dropdown menu -->
      <div
          id="dropdownDots"
          class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600"
      >
        <ul
            class="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownMenuIconButton"
        >
          <li>
            <a
                href="#"
                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >Modifier</a
            >
          </li>
          <li>
            <a
                href="#"
                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >Enlever</a
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
