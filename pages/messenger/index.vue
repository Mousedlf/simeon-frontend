<script lang="ts" setup>
import {computed, ref, watch} from 'vue';
import type {Trip} from '~/types/trip';
import type {Conversation, Message} from '~/types/conversation';
import {useAuthStore} from "~/store/auth";

const router = useRouter();
const config = useRuntimeConfig();
const input = ref<string | null>(null);
const {user} = storeToRefs(useAuthStore());
const toast = useToast();

const selectedTripId = ref<number | null>(null);

const defaultTripImage = 'https://i-de.unimedias.fr/2023/12/07/det1-peyresourd-0341-6571e6b76b623.jpg?auto=format%2Ccompress&crop=faces&cs=tinysrgb&fit=max&w=1050';
const defaultProfileImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCQ5uDxEKaeg-oV_AKOqwnTFoxR1gHUZ1EwQ&s';

const {
  data: tripsData,
  error: tripsError
} = await useAuthenticatedFetch<Trip[]>(`/trip/all/${user.value?.id}`, {method: 'GET',});
const trips = ref<Trip[]>(tripsData.value || []);
if (tripsError.value) {
  console.error('Erreur lors de la récupération des voyage:', tripsError.value);
}

const {
  data: conversationData,
  error: conversationError,
  refresh: refreshConversation
} = await useAuthenticatedFetch<Conversation | null>(() => selectedTripId.value ? `/conversation/${selectedTripId.value}` : null);
const conversation = ref<Conversation | null>(conversationData.value || null);

watch(conversationData, (newConversation) => {
  conversation.value = newConversation;
});

async function selectTrip(tripId: number) {
  selectedTripId.value = tripId;
  await refreshConversation();
}

const processedMessages = computed(() => {
  if (!conversation.value?.messages) return [];

  const result = [];
  let lastDate = null;

  for (const message of conversation.value.messages) {
    const currentDate = new Date(message.createdAt).toDateString();

    if (currentDate !== lastDate) {
      result.push({
        ...message,
        isSeparator: true
      });
      lastDate = currentDate;
    }
    result.push({
      ...message,
      isSeparator: false
    });
  }

  return result;
});

const sendMessage = async (tripId: number) => {
  if (!input.value) return;

  try {
    const {
      data: resData,
      error: apiError
    } = await useAuthenticatedFetch(`${config.public.baseUrlApi}/conversation/${tripId}/message/new`, {
      method: 'POST',
      body: {
        content: input.value
      }
    });

    if (apiError.value) {
      console.error("Erreur lors de l'envoi du message.", apiError.value);
      toast.add({
        title: "Erreur lors de l'envoi du message",
        color: 'error',
        duration: 2000
      });
    } else {
      input.value = '';
      await refreshConversation();
    }
  } catch (err) {
    console.error(err);
    toast.add({
      title: "Erreur inattendue lors de l'envoi du message",
      color: 'error',
      duration: 2000
    });
  }
};
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
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- conv selectionnée -->
    <div class="w-5/6">
      <div v-if="selectedTripId" class="h-full">
        <div class="border-b-2 border-b-blue-300 h-1/16 p-2">
          <h2 class="">Conversation : {{ trips.find(t => t.id === selectedTripId)?.name }}</h2>
        </div>
        <div v-if="conversation" class="h-14/16 p-2 overflow-scroll scroll-auto">
          <div v-for="message in processedMessages" :key="message.id" class="mb-2">
            <div v-if="message.isSeparator">
              <USeparator :label="$dayjs(message.createdAt).format('dd. DD MMMM')"/>
            </div>
            <div v-if='message.author.participant.id === user?.id' class="flex items-start flex-row-reverse gap-2.5">
              <UAvatar :src="defaultProfileImage"/>
              <div class="flex flex-col gap-1 w-full max-w-[320px]">
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

      <div v-else class="text-gray-500 w-full h-full flex items-center justify-center">
        Sélectionnez une conversation pour afficher son contenu.
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>