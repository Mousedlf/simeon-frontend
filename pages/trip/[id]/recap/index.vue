<script setup lang="ts">

const route = useRoute();
const tripId = route.params.id;

</script>

<template>
  <Subheader
      title="Recap Trip X" >
  <slot>
    <UButton
        :to="`/trip/${tripId}`"
        label="Voir le dashboard"
    />
    <UButton
        to=""
        label="Télecharger pdf"
    />

  </slot>
  </Subheader>

</template>

<style scoped>

</style>