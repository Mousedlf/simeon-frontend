<script setup lang="ts">

defineProps({
  label: {
    type: String,
    required: true
  },

});

</script>

<template>

  <UButton class=""
           block type="submit">
    {{ label }}
  </UButton>

</template>

<style scoped>


</style>