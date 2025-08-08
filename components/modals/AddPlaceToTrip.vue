<script setup lang="ts">
import { ref } from 'vue';
import type { ItineraryPlace } from '~/types/itinerary-place';

const props = defineProps<{
  place: ItineraryPlace;
}>();

const emit = defineEmits(['close']);

const note = ref(props.place.note || '');

const savePlace = () => {
  console.log('Lieu à sauvegarder:', {
    ...props.place,
    note: note.value
  });

  emit('close');
};
</script>

<template>
  <UModal>
    <div class="p-4">
      <h2 class="text-xl font-bold mb-4">Ajouter {{ place.name }} à votre voyage</h2>

      <div class="flex justify-end gap-2">
        <UButton
            color="neutral"
            variant="outline"
            @click="emit('close')"
        >
          Annuler
        </UButton>
        <UButton
            color="primary"
            @click="savePlace"
        >
          Ajouter
        </UButton>
      </div>
    </div>
  </UModal>
</template>