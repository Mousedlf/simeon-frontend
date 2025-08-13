<script lang="ts" setup>
import {nextTick, onMounted, ref, watch} from 'vue';
import {Loader} from '@googlemaps/js-api-loader';
import type {TripActivity} from '~/types/trip-activity';

const mapContainer = ref<HTMLElement | null>(null);
const searchInput = ref<HTMLInputElement | null>(null);
const searchInputText = ref('');
let mapInstance: google.maps.Map;
const props = defineProps<{
  places: TripActivity[];
  activeDayId: number | null;
  tripId: number | null;
}>();

const markers = ref<google.maps.Marker[]>([]);
let searchMarker: google.maps.Marker | null = null;
let customIcons: any;
let infoWindow: google.maps.InfoWindow;

const handleInput = (event: Event) => {
  searchInputText.value = (event.target as HTMLInputElement).value;
};

const clearSearch = () => {
  searchInputText.value = '';
  if (searchInput.value) {
    searchInput.value.value = '';
  }
  if (searchMarker) {
    searchMarker.setMap(null);
    searchMarker = null;
  }
  infoWindow.close();
};

onMounted(async () => {
  await nextTick();

  const config = useRuntimeConfig();
  const apiKey = config.public.googleMapsApiKey as string;

  if (!apiKey) {
    console.error('La clé API Google Maps n\'est pas configurée.');
    return;
  }

  if (!mapContainer.value) {
    console.error('L\'élément de carte est toujours null.');
    return;
  }

  const loader = new Loader({
    apiKey: apiKey,
    version: 'weekly',
    libraries: ['places', 'marker'],
    language: 'fr',
  });

  try {
    await loader.load();
    const defaultLocation = {lat: 48.8566, lng: 2.3522};
    mapInstance = new window.google.maps.Map(mapContainer.value as HTMLElement, {
      center: defaultLocation,
      zoom: 12,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      rotateControl: false,
    });

    customIcons = {
      default: {
        url: '/images/marker_place.svg',
        scaledSize: new window.google.maps.Size(40, 40),
        anchor: new window.google.maps.Point(20, 40),
      },
      highlighted: {
        url: '/images/marker_place_highlighted.svg',
        scaledSize: new window.google.maps.Size(40, 40),
        anchor: new window.google.maps.Point(20, 40),
      },
      search: {
        url: '/images/marker_searched_place.svg',
        scaledSize: new window.google.maps.Size(40, 40),
        anchor: new window.google.maps.Point(20, 40),
      },
    };
    infoWindow = new window.google.maps.InfoWindow();

    if (searchInput.value) {
      const autocomplete = new window.google.maps.places.Autocomplete(searchInput.value, {
        fields: ['geometry', 'name', 'formatted_address'],
        types: ['geocode', 'establishment'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
          console.error('Aucun détail de géométrie pour le lieu.');
          return;
        }

        if (searchMarker) {
          searchMarker.setMap(null);
        }

        mapInstance.setCenter(place.geometry.location);
        mapInstance.setZoom(15);

        searchMarker = new window.google.maps.Marker({
          map: mapInstance,
          position: place.geometry.location,
          title: place.name,
          icon: customIcons.search,
        });


        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = `
              <div class="p-4 rounded-lg shadow-md bg-white max-w-xs">
                <h3 class="text-lg font-bold text-gray-900 mb-1">${place.name}</h3>
                <p class="text-sm text-gray-600 mb-2">${place.formatted_address || ''}</p>
                <button class="add-place-button mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200">
                  Ajouter au voyage
                </button>
              </div>
            `;

        const button = contentDiv.querySelector('.add-place-button');
        if (button) {
          button.addEventListener('click', () => {
            const activityMapData = {
              name: place.name,
              address: place.formatted_address,
              longitude: place.geometry.location.lng(),
              latitude: place.geometry.location.lat(),
            };

            sessionStorage.setItem('newTripActivityPlace', JSON.stringify(activityMapData));
            window.location.href = `/trip/${props.tripId}/day/${props.activeDayId}/activity/new`;
          });
        }

        infoWindow.setContent(contentDiv);

        infoWindow.open({
          anchor: searchMarker,
          map: mapInstance,
        });
      });

    }

    updateMarkers(props.places, props.activeDayId);
  } catch (error) {
    console.error("Erreur lors du chargement de l'API Google Maps:", error);
  }
});

function updateMarkers(places: TripActivity[], activeDayId: number | null) {
  if (!mapInstance) {
    console.warn("mapInstance non initialisée, impossible de mettre à jour les marqueurs.");
    return;
  }

  markers.value.forEach((marker) => {
    marker.setMap(null);
  });
  markers.value = [];

  places.forEach((place) => {
    if (place.latitude && place.longitude) {
      const isHighlighted = place.dayId === activeDayId;
      const iconToUse = isHighlighted ? customIcons.highlighted : customIcons.default;

      const marker = new window.google.maps.Marker({
        position: {lat: place.latitude, lng: place.longitude},
        map: mapInstance,
        title: place.name || 'Lieu sans nom',
        icon: iconToUse,
      });

      marker.addListener('click', () => {
        const content = document.createElement('div');
        content.innerHTML = `
          <div class="p-4 rounded-lg shadow-md bg-white max-w-xs">
            <h3 class="text-lg font-bold text-gray-900 mb-1">${place.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${place.address || ''}</p>
            <p class="text-sm text-gray-800">${place.note || ''}</p>
          </div>
        `;
        infoWindow.setContent(content);
        infoWindow.open({
          anchor: marker,
          map: mapInstance,
        });
      });

      markers.value.push(marker);
    }
  });
}

watch([() => props.places, () => props.activeDayId], ([newPlaces, newActiveDayId]) => {
  if (mapInstance && newPlaces) {
    updateMarkers(newPlaces, newActiveDayId);
  }
}, {deep: true, immediate: true});
</script>

<template>
  <div class="relative w-full h-full">
    <div class="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-3/4">
      <input
          id="search-input"
          ref="searchInput"
          class="w-full p-2 rounded-md shadow-md focus:outline-none bg-white border-blue-800 border-2"
          placeholder="Rechercher un lieu pour ensuite l'ajouter au voyage"
          type="text"
          @input="handleInput"
      />
      <button
          v-if="searchInputText"
          class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          @click="clearSearch"
      >
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path clip-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                fill-rule="evenodd"/>
        </svg>
      </button>
    </div>
    <div ref="mapContainer" class="w-full h-full"></div>
  </div>
</template>

<style scoped>
</style>