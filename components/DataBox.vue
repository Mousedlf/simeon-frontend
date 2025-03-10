<script setup lang="ts">

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  spent: {
    type: Number,
  },
  total: {
    type: Number,
  },
  progress:{
    type: String,

  }
})


const progressValue = ref(props.progress);


</script>

<template>

  <div class="border rounded py-6 px-20 flex flex-col justify-center items-center ">
    <p>{{text}}</p>
    <p><span>{{ spent }}</span>/ {{total}}</p>
    <UProgress v-model="progressValue"  /> <!-- color="error" -->

  </div>

</template>

<style scoped>

</style>