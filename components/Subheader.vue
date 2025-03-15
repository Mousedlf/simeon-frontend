<script setup lang="ts">

defineProps({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: false
  },
})

</script>

<template>

  <div class="bg-white">
    <div class="px-2 bg-primary-500 py-16 flex items-center flex-col mb-4 md:mb-16">
      <h1>{{ title }}</h1>
      <p>{{ text }}</p>
      <slot ></slot>
    </div>
  </div>

</template>

<style scoped>

</style>