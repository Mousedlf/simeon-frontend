<script setup lang="ts">
defineProps({
  label: {
    type: String,
    required: true
  },
  redirect:{
    type: String,
  },
  size:{
    type:undefined
  }

});

</script>

<template>

  <UButton class="font-semibold mr-2 bg-blue-500 hover:bg-blue-800 text-center"
           :to="redirect"
           size="md"
  >
    {{ label }}
  </UButton>

</template>

<style scoped>


</style>