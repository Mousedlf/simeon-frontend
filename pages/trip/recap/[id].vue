<script setup lang="ts">

</script>

<template>
  <Subheader
      title="Recap Trip X" >
  <slot>
    <Button
        to="/trip/1"
        label="Voir le dashboard"
    />
    <Button
        to="/trip/recap"
        label="Télecharger pdf"
    />

  </slot>
  </Subheader>

</template>

<style scoped>

</style>