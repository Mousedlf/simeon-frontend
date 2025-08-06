text
<script setup lang="ts">
import {ref} from 'vue';
import type {Trip} from '~/types/trip';
import type {Conversation} from '~/types/conversation';
import Cookies from "universal-cookie";

const trips = ref<Trip[]>([]);
const selectedTripId = ref<string | null>(null);
const conversation = ref<Conversation>();
const cookies = new Cookies();
const config = useRuntimeConfig();
const router = useRouter();
const input = ref<string | null>(null);
const token = cookies.get('token')


async function loadTrips() {

  try {

    if (!token) {
      await router.push('/login');
    }
    const res = await fetch(`${config.public.baseUrlApi}/conversation/all`, { // authenticatedFetch
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.token}`,
      },
    });

    trips.value = await res.json();

  } catch (error) {
    console.log(error)
  }
}

onMounted(loadTrips);

async function selectTrip(tripId: string) {
  selectedTripId.value = tripId;
  try {
    const token = cookies.get('token')

    const res = await fetch(`${config.public.baseUrlApi}/conversation/${tripId}`, { // authenticatedFetch
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.token}`,
      },
    });

    conversation.value = await res.json();
  } catch (error) {
    console.error(error);
  }
}

const processedMessages = computed(() => {
  if (!conversation.value?.messages) return []

  const result = []
  let lastDate = null

  for (const message of conversation.value.messages) {
    const currentDate = new Date(message.createdAt).toDateString()

    if (currentDate !== lastDate) {
      result.push({
        ...message,
        isSeparator: true
      })
      lastDate = currentDate
    }
    result.push({
      ...message,
      isSeparator: false
    })
  }

  return result
})

async function sendMessage(convId) {
  try {
    const res = await fetch(`${config.public.baseUrlApi}/conversation/${convId}/message/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.token}`,
      },
      body: JSON.stringify({
        content: input.value
      })
    });

    const responseData = await res.json()

    if (!res.ok) {
      console.log(responseData)
      input.value = ''
    }

  } catch (error: any) {
    console.error(error)
  }
}

const defaultTripImage = 'https://i-de.unimedias.fr/2023/12/07/det1-peyresourd-0341-6571e6b76b623.jpg?auto=format%2Ccompress&crop=faces&cs=tinysrgb&fit=max&w=1050';
const defaultProfileImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCQ5uDxEKaeg-oV_AKOqwnTFoxR1gHUZ1EwQ&s';

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
            <img class="size-12 flex-none rounded-xl bg-gray-50" :src="trip.imageSrc || defaultTripImage"
                 :alt="trip.name">
            <div class="min-w-0 flex-auto">
              <p class="text-sm/6 font-semibold text-gray-900">{{ trip.name }}</p>
              <!--              <p class="mt-1 truncate text-xs/5 text-gray-500">dernier message ?</p>-->
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div class="w-5/6">

      <!--      if a conversation is selected-->
      <div v-if="selectedTripId" class="h-full">
        <div class="border-b-2 border-b-blue-300 h-1/16 p-2">
          <h2 class="">Conversation : {{ trips.find(t => t.id === selectedTripId)?.name }}</h2>
        </div>
        <div v-if="conversation" class="h-14/16 p-2 overflow-scroll scroll-auto">
          <!-- display messages -->
          <div v-for="message in processedMessages" :key="message.id" class="mb-2">
            <div v-if="message.isSeparator">
              <USeparator :label="$dayjs(message.createdAt).format('dd. DD MMMM')"/>
            </div>
            <div v-if='message.author.participant.username === "caroline"'
                 class="flex items-start flex-row-reverse gap-2.5">
              <UAvatar :src="defaultProfileImage"/>
              <div class="flex flex-row-reverse gap-1 w-full max-w-[320px]">
                <div class="">
                  <div class="flex items-center space-x-2 rtl:space-x-reverse">
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">{{
                      message.author.participant.username
                    }}</span>
                    <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {{ $dayjs(message.createdAt).format('hh:mm, DD/MM') }}
                    </span>
                  </div>
                  <div
                      class="flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                    <p class="text-sm font-normal text-gray-900 dark:text-white"> {{ message.content }}</p>
                  </div>
                </div>
                <button id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots"
                        data-dropdown-placement="bottom-start"
                        class="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600"
                        type="button">
                  <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                       xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                    <path
                        d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
                  </svg>
                </button>
                <div id="dropdownDots"
                     class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-40 dark:bg-gray-700 dark:divide-gray-600">
                  <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                    <li>
                      <a href="#"
                         class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                    </li>
                    <li>
                      <a href="#"
                         class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div v-else class="flex items-start gap-2.5">
              <UAvatar :src="defaultProfileImage"/>
              <div class="flex flex-col gap-1 w-full max-w-[320px]">
                <div class="flex items-center space-x-2 rtl:space-x-reverse">
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">{{
                      message.author.participant.username
                    }}</span>
                  <span class="text-sm font-normal text-gray-500 dark:text-gray-400">{{
                      $dayjs(message.createdAt).format('h:mm, DD/MM')
                    }}</span>
                </div>
                <div
                    class="flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                  <p class="text-sm font-normal text-gray-900 dark:text-white"> {{ message.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="border-t-2 border-t-blue-300 h-1/16 p-2 flex">
          <input
              type="text" placeholder="Ecrire un message"
              class="w-full focus:outline-0"
              v-model="input"
          >
          <UIcon name="i-material-symbols:send-rounded" @click="sendMessage(selectedTripId)"
                 class="size-7 bg-blue-800 cursor-pointer"/>
        </div>
      </div>

      <!--      if no conversation is selected-->
      <div v-else class="text-gray-500 w-full h-full">
        Sélectionnez une conversation pour afficher son contenu.
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>