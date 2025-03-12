<script setup lang="ts">

const trips = [{
  id: 1,
  name: 'Lyon',
  dates: '26 Nov - 30 Nov, 2024',
  upcoming: false,
  description: 'Though the specification doesn\'t put requirements on the name of classes, web developers are encouraged ',
  imageSrc: 'https://www.sncf-connect.com/assets/styles/scale_max_width_961/public/media/2020-02/fontaine%20lyon%20-iStock-manjik.jpg?itok=A4OVzREs',
  imageAlt: 'Place des jacobins',
}, {
  id: 2,
  name: 'Marseille',
  dates: '5 Dec - 8 Dec, 2024',
  upcoming: false,
  description: 'Though the specification doesn\'t put requirements on the name of classes, web developers are encouraged ',
  imageSrc: 'https://www.wonderbox.fr/blog/wp-content/uploads/sites/4/2020/02/Visiter-Marseille-en-10-lieux-marseille-scaled-1-1.jpeg',
  imageAlt: 'marseille'
}, {
  id: 3,
  name: 'Paris',
  dates: '18 Fev - 24 Fev, 2025',
  description: 'Though the specification doesn\'t put requirements on the name of classes, web developers are encouraged ',
  upcoming: true,
  imageSrc: 'https://img.static-af.com/transform/45cb9a13-b167-4842-8ea8-05d0cc7a4d04/',
  imageAlt: 'tour eiffel',
  participants: [
    {
      "id": 9,
      "participant": {
        "id": 4,
        "username": "caroline",
        "imageSrc": 'https://github.com/romhml.png',
      },
      "role": "owner"
    },
    {
      "id": 10,
      "participant": {
        "id": 5,
        "username": "max",
        "imageSrc": 'https://github.com/benjamincanac.png',
      },
      "role": "editor"
    }
  ]
}, {
  id: 4,
  name: 'Hawaii',
  dates: '18 Jun - 24 Jun, 2025',
  upcoming: true,
  description: 'Though the specification doesn\'t put requirements on the name of classes, web developers are encouraged ',
  imageSrc: 'https://www.voyageursdumonde.fr/voyage-sur-mesure/img/mag/201602/montagne-a-hawaii.jpg',
  imageAlt: 'tour eiffel'
}, {
  id: 4,
  name: 'Hawaii',
  dates: '18 Jun - 24 Jun, 2025',
  upcoming: false,
  description: 'Though the specification doesn\'t put requirements on the name of classes, web developers are encouraged ',
  imageSrc: 'https://www.voyageursdumonde.fr/voyage-sur-mesure/img/mag/201602/montagne-a-hawaii.jpg',
  imageAlt: 'tour eiffel'
}]

const tabs = [{
  label: 'A venir',
  slot: 'upcoming',
}, {
  label: 'Passés',
  slot: 'past',
}]

const upcomingTrips = computed(() => trips.filter(trip => trip.upcoming));
const pastTrips = computed(() => trips.filter(trip => !trip.upcoming));


</script>

<template>

  <div class="bg-white">

    <Subheader
        title="Une phrase suberbe pour introduire les voyages"
        text="Though the specification doesn't put requirements on the name of classes, web developers are encouraged ">
      <div class="container align-middle border border-white mt-4 py-6">
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

    <Container>
      <div class="md:flex md:items-center md:justify-between">
        <UTabs :items="tabs"
               :default-index="0"
               class="bg-white w-full"
               variant="link"
               size="xl"
        >
          <template #upcoming="{ item }">

            <div class="mt-6">
              <div v-for="trip in upcomingTrips" :key="trip.id" class="group relative mb-2">
                  <a class="flex"
                     :href="'/trip/'+ trip.id">
                    <div
                        class="h-56 w-full md:w-1/2 overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
                      <img :src="trip.imageSrc" :alt="trip.imageAlt" class="size-full object-cover"/>
                    </div>
                    <div class="ml-2">
                      <h3 class="mt-4 text-gray-700">{{ trip.name }}</h3>
                      <p>{{ trip.description }}</p>
                      <span class="text-gray-400 text-sm flex align-middle mt-2">
                        <UIcon name="i-heroicons-calendar-days-solid" class="w-5 h-5"/>{{ trip.dates }}
                      </span>

                      <div class="hidden md:block mt-3">
                        <UAvatarGroup v-for="participant in trip.participants">
                          <UAvatar
                              :src="participant.participant.imageSrc"
                              :alt="participant.participant.username"
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

            <div class="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
              <div v-for="trip in pastTrips" :key="trip.id" class="group relative ">
                  <a :href="'/trip/'+ trip.id">
                    <div
                        class="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
                      <img :src="trip.imageSrc" :alt="trip.imageAlt" class="size-full object-cover"/>
                    </div>
                    <h4 class="mt-4 text-sm text-gray-700">
                        <span class="absolute inset-0"/>{{ trip.name }}
                    </h4>
                      <p class="text-gray-400 flex align-middle">
                        <UIcon name="i-heroicons-calendar-days-solid" class="w-5 h-5"/>{{ trip.dates }}
                      </p>
                  </a>
              </div>
            </div>

          </template>
        </UTabs>
      </div>
    </Container>
  </div>


</template>

<style scoped>

</style>