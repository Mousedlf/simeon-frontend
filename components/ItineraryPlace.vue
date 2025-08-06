<script setup lang="ts">

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  imageSrc: {
    type: String,
    default: '',
  },
  open: {
    type: Boolean,
    default: false,
  },
  openingHours: {
    type: Array ,
    default: () => [],
  },
  note: {
    type: String,
    default: '',
  },
});


const handleNoteAction = async () => {
  const endpoint = props.note ? '/edit/note' : '/add/note'

  console.log(endpoint);
}
</script>

<template>
  <div class="itinerary-place flex">
    <img v-if="props.imageSrc" :src="props.imageSrc" alt="Image of place" />
    <div class="pl-5">
      <h2>{{ props.name }}</h2>
      <p>{{ props.address }}</p>
      <p v-if="props.open"><strong class="text-green-900">Ouvert</strong></p>
      <p v-else><strong>Fermé</strong></p>
      <ul v-if="props.openingHours.length">
        <li v-for="(hour, index) in props.openingHours" :key="index">
          {{ hour }}
        </li>
      </ul>

      <UInput
          :placeholder="props.note || 'ajouter une note'"
          :ui="{ trailing: 'pe-1' }"
      >
        <template #trailing>
          <UButton
              color="neutral"
              variant="link"
              size="md"
              :icon="props.note ? 'i-ic:baseline-edit' : 'i-heroicons:check-16-solid'"
              :aria-label="props.note ? 'Modifier la note' : 'Ajouter la note'"
              @click="handleNoteAction"
          />
        </template>
      </UInput>
    </div>
  </div>
</template>

<style scoped>
.itinerary-place {
  padding: 1rem;
  max-width: 1000px;
}
img {
  max-width: 100%;
  border-radius: 6px;
}
</style>
