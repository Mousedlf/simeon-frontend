<script setup lang="ts">

import {useAuthStore} from "~/store/auth";

const { user } = storeToRefs(useAuthStore())

</script>

<template>
  <Subheader
      :title="`Bonjour ${user?.username}`"  />

  <UContainer>
    <div>
      <div class="px-4 sm:px-0 flex flex-col md:flex-row md:items-center justify-between">
        <div class="">
          <h2 class="">Tes informations</h2>
          <p class="mt-1 max-w-2xl text-sm/6 text-gray-500">Détails personnels et de l'application.</p>
        </div>
        <div class="mt-2 md:mt-0">
          <UModal
              title="Modification de tes informations"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          >
            <Button label="Modifier mes informations"/>

            <template #body>
              <p>formulaire</p>
            </template>
          </UModal>
        </div>
      </div>
      <div class="mt-6 border-t border-gray-100">
        <dl class="divide-y divide-gray-100">
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class=" font-medium text-gray-900">pseudo</dt>
            <dd class="mt-1  text-gray-700 sm:col-span-2 sm:mt-0">{{ user?.username }}</dd>
          </div>
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class=" font-medium text-gray-900">email</dt>
            <dd class="mt-1  text-gray-700 sm:col-span-2 sm:mt-0">{{ user?.email }}</dd>
          </div>
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class=" font-medium text-gray-900">visibilité</dt>
            <dd class="mt-1  text-gray-700 sm:col-span-2 sm:mt-0">
              {{ user?.public ? 'public' : 'privé' }}
            </dd>
          </div>
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class=" font-medium text-gray-900">Monnaie par défaut</dt>
            <dd class="mt-1  text-gray-700 sm:col-span-2 sm:mt-0">
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </UContainer>


</template>

<style scoped>

</style>