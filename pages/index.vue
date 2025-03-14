<script setup lang="ts">

import type { Trip } from '~/types/trip';
import Cookies from "universal-cookie";

const tabs = [{
  label: 'A venir',
  slot: 'upcoming',
}, {
  label: 'Passés',
  slot: 'past',
}]

const cookies = new Cookies();
const config = useRuntimeConfig();
const trips = ref<Trip[]>([]);
const router = useRouter();

async function getTrips(){
  try{

    const token = cookies.get('token')

    if (!token) {
      router.push('/login');
    }

    const res = await fetch(`${config.public.baseUrlApi}/trip/all/10`, { // authenticatedFetch
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.token}` ,
      },
    });

    trips.value = await res.json();

  }catch(error){
    console.log("catch", error)
  }
}

const upcomingTrips = computed(() => {
  const now = new Date();
  return trips.value.filter(trip => new Date(trip.startDate) >= now);
});

const pastTrips = computed(() => {
  const now = new Date();
  return trips.value.filter(trip => new Date(trip.endDate) < now);
});

onMounted(() => {
  getTrips();
});

const defaultTripImage = 'https://www.voyageursdumonde.fr/voyage-sur-mesure/img/mag/201602/montagne-a-hawaii.jpg';
const defaultProfileImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCQ5uDxEKaeg-oV_AKOqwnTFoxR1gHUZ1EwQ&s';

///
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('fr-FR', { month: 'long' });
  const year = date.getFullYear();
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
        text="Though the specification doesn't put requirements on the name of classes, web developers are encouraged"
    >
      <div class="container align-middle border border-white py-6 mt-6">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <dl class="grid grid-cols-1 gap-y-8 text-center grid-cols-3">
            <div class="mx-auto flex max-w-xs flex-col">
              <dt class="text-base/7 text-gray-600">jours de voyage</dt>
              <dd class="order-first text-2xl md:text-4xl font-semibold tracking-tight ">54</dd>
            </div>
            <div class="mx-auto flex max-w-xs flex-col">
              <dt class="text-base/7 text-gray-600">villes visitées</dt>
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
        <UTabs :items="tabs"
               :default-index="0"
               class=" w-full py-0"
               variant="link"
               size="xl"
        >
          <template #upcoming="{ item }">

            <div class="">
              <div v-for="trip in upcomingTrips" :key="trip.id" class="group relative mb-2">
                  <a class="flex"
                     :href="'/trip/'+ trip.id">
                    <div
                        class="h-56 w-full md:w-1/2 overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
                      <img :src="trips.imageSrc || defaultTripImage" alt="image" class="size-full object-cover"/>
                    </div>
                    <div class="ml-6">
                      <h3 class="mt-4 text-gray-700">{{ trip.name }}</h3>
                      <p>{{ trip.description }}</p>
                      <span class="text-gray-400 text-sm flex align-middle mt-2">
                        <UIcon name="i-heroicons-calendar-days-solid" class="w-5 h-5"/>{{ formatDateRange(trip.startDate, trip.endDate) }}
                      </span>

                      <div class="hidden md:block mt-3">
                        <UAvatarGroup v-for="participant in trip.participants">
                          <UAvatar
                              :src="participant.imageSrc || defaultProfileImage"
                              alt="participant"
                              size="lg"
                          />

                        </UAvatarGroup>
                      </div>
                    </div>
                  </a>
              </div>
            </div>

          </template>

          <template #past="{ item }">

            <div class="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
              <div v-for="trip in pastTrips" :key="trip.id" class="group relative ">
                  <a :href="'/trip/'+ trip.id">
                    <div
                        class="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
                      <img :src="trip.imageSrc || defaultTripImage" :alt="trip.imageAlt" class="size-full object-cover"/>
                    </div>
                    <h4 class="mt-4 text-sm text-gray-700">
                        <span class="absolute inset-0"/>{{ trip.name }}
                    </h4>
                      <p class="text-gray-400 flex align-middle">
                        <UIcon name="i-heroicons-calendar-days-solid" class="w-5 h-5"/>
                        {{ formatDateRange(trip.startDate, trip.endDate) }}
                      </p>
                  </a>
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