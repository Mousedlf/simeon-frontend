<script setup lang="ts">

defineProps({
  label: {
    type: String,
    required: true
  },
  redirect:{
    type: String,
  }

});

</script>

<template>

  <UButton class="font-semibold text-md mx-2"
           block type="submit"
           :to="redirect"
  >
    {{ label }}
  </UButton>

</template>

<style scoped>


</style>