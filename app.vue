<template>
  <UApp>
    <NuxtLayout>

      <Navbar v-if="authenticated" />
      <NuxtPage class="min-h-[90vh]"/>
      <Footer/>
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import {useAuthStore} from "~/store/auth";
const authStore = useAuthStore()
const { authenticated } = storeToRefs(authStore)

</script>