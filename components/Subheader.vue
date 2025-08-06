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
  bgColor: {
    type: String,
    default: 'bg-primary-500'
  },
})

</script>

<template>

  <div>
    <div :class="['px-2', bgColor, 'py-12', 'flex', 'items-center', 'flex-col', 'mb-4', 'md:mb-16']">
      <UContainer>
        <h1>{{ title }}</h1>
        <p>{{ text }}</p>
        <slot ></slot>
      </UContainer>

    </div>
  </div>

</template>

<style scoped>

</style>