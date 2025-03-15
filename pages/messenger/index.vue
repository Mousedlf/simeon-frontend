text
<script setup lang="ts">
import { ref } from 'vue';
import type { Trip } from '~/types/trip';
import type { Conversation } from '~/types/conversation';
import Cookies from "universal-cookie";

const trips = ref<Trip[]>([]);
const selectedTripId = ref<string | null>(null);
const conversation = ref<Conversation>();
const cookies = new Cookies();
const config = useRuntimeConfig();
const router = useRouter();


async function loadTrips() {

 try {
   const token = cookies.get('token')

   if (!token) {
     await router.push('/login');
   }
   const res = await fetch(`${config.public.baseUrlApi}/conversation/all`, { // authenticatedFetch
     method: 'GET',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${token.token}` ,
     },
   });

   trips.value = await res.json();
   console.log(trips);

 }catch(error){
   console.log(error)
 }
}

async function selectTrip(tripId: string) {
  selectedTripId.value = tripId;
  try {
    const token = cookies.get('token')

    const res = await fetch(`${config.public.baseUrlApi}/conversation/${tripId}`, { // authenticatedFetch
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.token}` ,
      },
    });

    conversation.value = await res.json();
  } catch (error) {
    console.error(error);
    conversation.value = 'Erreur lors du chargement de la conversation.';
  }
}

onMounted(loadTrips);

const defaultTripImage = 'https://www.bagagesavivre.fr/media/9752/big/voyage-avion-conseils.jpg';

</script>

<template>
  <div class="flex h-screen border-t border-t-blue-300">
    <div class="bg-blue-300 w-1/6 md:px-4 pt-4">
      <ul role="list" class="divide-y divide-white">
        <li v-for="trip in trips" :key="trip.id"
            @click="selectTrip(trip.id)"
            class="flex justify-between gap-x-6 py-3 border-b border-b-white cursor-pointer hover:bg-blue-500 transition-colors duration-200"
            :class="{ 'bg-blue-500': selectedTripId === trip.id }">
          <div class="flex min-w-0 gap-x-4">
            <img class="size-12 flex-none rounded-xl bg-gray-50" :src="trip.imageSrc || defaultTripImage" :alt="trip.name">
            <div class="min-w-0 flex-auto">
              <p class="text-sm/6 font-semibold text-gray-900">{{ trip.name }}</p>
<!--              <p class="mt-1 truncate text-xs/5 text-gray-500">dernier message ?</p>-->
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div class="w-5/6 p-4">
      <div v-if="selectedTripId">
        <h2 class="">Conversation : {{ trips.find(t => t.id === selectedTripId)?.name }}</h2>
        <div v-if="conversation" class="bg-white p-4 rounded-lg shadow">
          <ul v-for="message in conversation.messages">
            <p>{{message.author.participant.username}} : {{message.content}}</p>
          </ul>
        </div>
        <div v-else class="text-gray-500">
          pas encore de messages dans cette conversation.
        </div>
      </div>
      <div v-else class="text-gray-500">
        Sélectionnez une conversation pour afficher son contenu.
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>