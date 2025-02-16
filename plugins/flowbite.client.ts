import { defineNuxtPlugin } from '#app';
import { initFlowbite } from 'flowbite';

export default defineNuxtPlugin(() => {
    return {
        provide: {
            flowbite: () => initFlowbite()
        }
    }
})