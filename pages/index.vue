<script lang="ts" setup>

import type {Trip} from '~/types/trip';
import {useAuthStore} from "~/store/auth";
import {ref} from "vue";

const tabs = [{
  label: 'A venir',
  slot: 'upcoming',
}, {
  label: 'Passés',
  slot: 'past',
}]

// const trips = ref<Trip[]>([]);
const {user} = storeToRefs(useAuthStore());

const {
  data: tripsData,
  error: tripsError
} = await useAuthenticatedFetch(`/trip/all/${user.value?.id}`, {method: 'GET',});
const trips = ref<Trip[]>(tripsData.value as Trip[] || []);
console.log(trips.value);
if (tripsError.value) {
  console.error('Erreur lors de la récupération du voyage:', tripsError.value);
}

const today = new Date();

const upcomingTrips = computed(() => {
  return trips.value.filter(trip => new Date(trip.startDate) >= today);
});

const pastTrips = computed(() => {
  return trips.value.filter(trip => new Date(trip.endDate) < today);
});

const defaultTripImage = 'https://i-de.unimedias.fr/2023/12/07/det1-peyresourd-0341-6571e6b76b623.jpg?auto=format%2Ccompress&crop=faces&cs=tinysrgb&fit=max&w=1050';
const defaultProfileImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCQ5uDxEKaeg-oV_AKOqwnTFoxR1gHUZ1EwQ&s';

///
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('fr-FR', {month: 'long'});
  return `${day} ${month.charAt(0).toUpperCase() + month.slice(1)}`;
}

function formatDateRange(startDate: string, endDate: string): string {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  const endYear = new Date(endDate).getFullYear();
  return `${start} - ${end} ${endYear}`;
}

</script>

<template>

  <div class="bg-white">

    <Subheader
        title="Une phrase suberbe pour introduire les voyages"
    >
      <div class="container align-middle border border-white py-6 mt-6">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <dl class="grid grid-cols-1 gap-y-8 text-center md:grid-cols-3">
            <div class="mx-auto flex max-w-xs flex-col">
              <dt class="text-base/7 text-gray-600">jours de voyage</dt>
              <dd class="order-first text-2xl md:text-4xl font-semibold tracking-tight ">54</dd>
            </div>
            <div class="mx-auto flex max-w-xs flex-col">
              <dt class="text-base/7 text-gray-600">pays visités</dt>
              <dd class="order-first text-2xl md:text-4xl font-semibold tracking-tight ">4</dd>
            </div>
            <div class="mx-auto flex max-w-xs flex-col">
              <dt class="text-base/7 text-gray-600">voyages</dt>
              <dd class="order-first text-2xl md:text-4xl font-semibold tracking-tight ">6</dd>
            </div>
          </dl>
        </div>
      </div>
    </Subheader>

    <UContainer>
      <div class="md:flex md:items-center md:justify-between">
        <UTabs :default-index="0"
               :items="tabs"
               class=" w-full"
               size="xl"
               variant="link"
        >
          <template #upcoming="{ item }">

            <div class="">
              <div v-if="upcomingTrips?.length === 0" class="py-16">
                <p class="italic text-gray-500">Pas de voyages à venir.</p>
                <NuxtLink class="accent-blue-800 underline" href="/trip/new">Ajouter un voyage</NuxtLink>
              </div>

              <div v-for="trip in upcomingTrips" :key="trip.id" class="group relative mb-2">
                <a :href="'/trip/'+ trip.id"
                   class="flex">
                  <div
                      class="h-56 w-full md:w-1/2 overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
                    <img :src="trip.imageSrc || defaultTripImage" alt="image" class="size-full object-cover"/>
                  </div>
                  <div class="ml-6">
                    <h3 class="mt-4 text-gray-700">{{ trip.name }}</h3>
                    <span class="text-gray-400 flex align-middle mb-2">
                        <UIcon class="w-5 h-5" name="i-heroicons-calendar-days-solid"/>
                      {{formatDateRange(trip.startDate, trip.endDate) }}
                      </span>
                    <p>{{ trip.description }}</p>


                    <div class="hidden md:block mt-3">
                      <UAvatarGroup v-if="trip.participants.length > 1 " size="lg">
                        <UAvatar
                            v-for="participant in trip.participants"
                            :key="participant.participant.id"
                            :alt="participant.participant.username"
                            :src="participant.participant.imageSrc || defaultProfileImage"
                        />
                      </UAvatarGroup>
                    </div>
                  </div>
                </a>
              </div>
            </div>

          </template>

          <template #past="{ item }">

            <div class="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-8 mt-8 mb-28">
              <div v-for="trip in pastTrips" :key="trip.id" class="group relative ">
                <NuxtLink :to="`/trip/${trip.id}/recap`">
                  <div
                      class="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
                    <img :alt="trip.imageAlt" :src="trip.imageSrc || defaultTripImage" class="size-full object-cover"/>
                  </div>
                  <h4 class="mt-4 text-sm text-gray-700">
                    <span class="absolute inset-0"/>{{ trip.name }}
                  </h4>
                  <p class="text-gray-400 flex align-middle">
                    <UIcon class="w-5 h-5" name="i-heroicons-calendar-days-solid"/>
                    {{ formatDateRange(trip.startDate, trip.endDate) }}
                  </p>
                </NuxtLink>
              </div>
            </div>

          </template>
        </UTabs>
      </div>
    </UContainer>
  </div>


</template>

<style scoped>

</style>