// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: {enabled: true},

    runtimeConfig: {
        public: {
            baseUrl: '127.0.0.1:8000'
        }
    },
    css: [
        '~/assets/css/main.css',
    ],
    modules: ['@nuxt/ui', '@nuxtjs/tailwindcss', '@nuxt/icon']
})