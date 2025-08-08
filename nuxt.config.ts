// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';


export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: {enabled: true},
    modules: [
        '@nuxt/ui',
        '@pinia/nuxt',
        'pinia-plugin-persistedstate/nuxt',
        'dayjs-nuxt'
    ],
    css: [
        '~/assets/main.css',
        '~/assets/rules.css',
        '~/assets/variables.css',
    ],
    runtimeConfig: {
        public: {
            baseUrlApi: '',
            googleMapsApiKey: process.env.MAPS_API_KEY,
            googleMapId: process.env.MAPS_ID,
        }
    },
})
