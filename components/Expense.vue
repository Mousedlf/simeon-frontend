<script setup lang="ts">
import { ref, computed } from 'vue';
import type { DayOfTrip} from "~/types/day-of-trip";

interface Participant {
  participant: {
    username: string;
  };
}

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  amountLocalCurrency: {
    type: Number,
    required: true,
  },
  amountEuro: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  categoryName: {
    type: String,
    default: 'Sans catégorie'
  },
  categoryIcon: {
    type: String,
    default: 'i-heroicons-tag-20-solid'
  },
  paidBy: {
    type: Object as () => Participant,
    required: true,
  },
  dividedWith: {
    type: Object as () => Participant,
    default: () => [],
  },
  paymentMethod: {
    type: String,
    default: '',
  },
  date: {
    type: String,
    required: false,
    default: null,
  },
  dayOfTrip: {
    type: Object as () => DayOfTrip,
    default: null,
  },
  note: {
    type: String,
    default: '',
  },
  personal: {
    type: Boolean,
    default: false,
  },
  divide: {
    type: Boolean,
    default: false,
  },
});

const isExpanded = ref(false);

const formattedDate = computed(() => {
  if (!props.date) return 'Date inconnue';
  const d = new Date(props.date);
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});
</script>

<template>
  <div class="bg-white p-4 border-b border-gray-200">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <UAvatar
            :icon="props.categoryIcon"
            size="md"
            class="flex-shrink-0"
        />
        <div>
          <p class="font-semibold text-gray-900">{{ props.name }}</p>
          <p class="text-sm text-gray-500">
            {{ props.categoryName }} •
            Payé par <span class="font-medium">{{ props.paidBy.participant.username }}</span>
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <div class="space-y-2 flex justify-end">
          <p class="text-lg font-semibold text-gray-900">- {{ props.amountEuro }} € <span v-if="props.currency.symbol != '€' " class="font-light">({{ props.amountLocalCurrency }} {{ props.currency.symbol }})</span></p>
        </div>
        <UButton
            :icon="isExpanded ? 'i-heroicons-chevron-up-20-solid' : 'i-heroicons-chevron-down-20-solid'"
            variant="ghost"
            color="gray"
            @click="isExpanded = !isExpanded"
        />
      </div>
    </div>

    <div v-if="isExpanded" class="mt-4 pt-4 border-gray-200">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-gray-500">Payé par :</p>
          <div class="flex items-center space-x-2">
            <p class="font-medium text-gray-900">{{ props.paidBy.participant.username }}</p>
          </div>
        </div>

        <div v-if="props.dividedWith && props.dividedWith.length > 0" class="flex items-center justify-between">
          <p class="text-gray-500">Divisé avec :</p>
          <div class="flex -space-x-1 overflow-hidden">
            <p v-for="(user, index) in props.dividedWith" :key="index" class="mr-2">{{ user }}</p>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <p class="text-gray-500">Date :</p>
          <p class="font-medium text-gray-900">{{ formattedDate }}</p>
        </div>
      </div>

      <hr v-if="props.note || props.paymentMethod" class="my-4 border-gray-200" />

      <div v-if="props.note || props.paymentMethod" class="space-y-4">
        <div v-if="props.note" class="flex flex-col">
          <p class="text-sm font-medium text-gray-700">Note :</p>
          <p class="mt-1 text-gray-600">{{ props.note }}</p>
        </div>
        <div v-if="props.paymentMethod" class="flex items-center justify-between">
          <p class="text-gray-500">Méthode de paiement :</p>
          <p class="font-medium text-gray-900">{{ props.paymentMethod }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
