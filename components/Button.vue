<script setup lang="ts">

defineProps({
  label: {
    type: String,
    required: true
  },

});

</script>

<template>

  <UButton class="font-semibold text-md"
           block type="submit">
    {{ label }}
  </UButton>

</template>

<style scoped>


</style>