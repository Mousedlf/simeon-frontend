<script setup lang="ts">


const infos = [{
  input: "Nom",
  value: "Caroline",
  },{
  input: "Email",
  value: "caroline@mail.com",
  },{
  input: "Monnaie",
  value: "euro (€)",
},
]

</script>

<template>
  <Subheader
      title="Bonjour [nom]"
  />

  <Container>
    <div>
      <div class="px-4 sm:px-0 flex flex-col md:flex-row md:items-center justify-between">
        <div class="">
          <h2 class="">Tes informations</h2>
          <p class="mt-1 max-w-2xl text-sm/6 text-gray-500">Personal details and application.</p>
        </div>
        <div class="mt-2 md:mt-0">
          <Button label="Modifier mes informations"/>
        </div>
      </div>
      <div class="mt-6 border-t border-gray-100">
        <dl class="divide-y divide-gray-100">
          <div v-for="info in infos" class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm/6 font-medium text-gray-900">{{ info.input }}</dt>
            <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{{ info.value }}</dd>
          </div>

        </dl>
      </div>
    </div>
  </Container>


</template>

<style scoped>

</style>