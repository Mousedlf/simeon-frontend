<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import useAuthenticatedFetch from '~/composables/useAuthenticatedFetch';

const toast = useToast();
const state = reactive({
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  public: true
})

const stepper = useTemplateRef('stepper')
const stepperItems = ref([
  {
    slot: "first",
    title: 'Nom et dates',
    description: 'Définir informations de base',
    icon: 'i-lucide-house'
  },
  {
    slot: "second",
    title: 'Ajout personnes',
    description: 'Inviter des participants  ',
    icon: 'i-lucide-truck'
  },
])

const participants = ref([
  {
    label: 'benjamincanac',
    value: 'benjamincanac',
    avatar: {
      src: 'https://github.com/benjamincanac.png',
      alt: 'benjamincanac'
    }
  },
  {
    label: 'romhml',
    value: 'romhml',
    avatar: {
      src: 'https://github.com/romhml.png',
      alt: 'romhml'
    }
  },
  {
    label: 'noook',
    value: 'noook',
    avatar: {
      src: 'https://github.com/noook.png',
      alt: 'noook'
    }
  }
])

async function createTrip(event: FormSubmitEvent<any>) {
  try {
    const { data: resData, error: apiError } = await useAuthenticatedFetch('/trip/new', {
      method: 'POST',
      body: JSON.stringify({
        name: state.name,
        description: state.description,
        startDate: state.startDate,
        endDate: state.endDate,
        public: state.public
      }),
    });

    if (apiError.value) {

      const errorMessage = apiError.value.data?.message || apiError.value.message || 'Une erreur est survenue.';
      toast.add({
        title: 'Erreur lors de la création du voyage',
        description: errorMessage,
        color: 'error',
        duration: 5000
      });

    } else if (resData.value) {

      toast.add({
        title: 'Nouveau voyage créé !',
        description: 'Votre voyage a été ajouté avec succès.',
        color: 'success',
        duration: 5000
      });

      stepper.value?.next();
    } else {

      toast.add({
        title: 'Erreur inconnue',
        description: 'La création du voyage n\'a pas retourné de données.',
        color: 'warning',
        duration: 5000
      });
    }

  } catch (error) {
    console.error("Erreur inattendue lors de la création du voyage:", error);
    toast.add({
      title: 'Erreur inattendue',
      description: 'Veuillez réessayer.',
      color: 'error',
      duration: 5000
    });
  }
}
</script>

<template>
  <div class="h-screen">
    <Subheader
        title="Créer un nouveau voyage"
        bg-color="bg-blue-500"
    >
    </Subheader>

    <UContainer>
      <UStepper ref="stepper"
                :items="stepperItems"
                class="w-full"
                orientation="vertical"
                disabled
      >
        <template #first >
          <div class="ml-8">
            <UForm :state="state"
                   class="space-y-4 "
                   @submit="createTrip">
              <UFormField label="Nom" name="name" required>
                <UInput v-model="state.name" type="text" class="w-full"/>
              </UFormField>

              <UFormField label="Description" name="description">
                <UTextarea v-model="state.description" type="text" :rows="4" class="w-full"/>
              </UFormField>

              <div class="flex gap-4">
                <UFormField label="Date de début" name="startDate" required>
                  <UInput v-model="state.startDate" type="date"  />
                </UFormField>

                <UFormField label="Date de fin" name="endDate" required>
                  <UInput v-model="state.endDate" type="date" />
                </UFormField>
              </div>

              <UFormField name="public">
                <USwitch
                    unchecked-icon="i-lucide-x"
                    checked-icon="i-lucide-check"
                    label="Voyage public"
                    v-model="state.public"
                />
              </UFormField>

              <UButton type="submit" label="Enregistrer et passer à la prochaine étape" class="mt-10" />

            </UForm>
          </div>
        </template>

        <template #second>
          <div class="ml-8">
            <p>ajout personnes</p>
            <UInputMenu multiple :items="items" delete-icon="i-lucide-trash" />
          </div>

          <UButton label="Ajouter plus tard" variant="outline" to="/"/>
          <UButton label="Enregistrer" />
        </template>

      </UStepper>

    </UContainer>
  </div>
</template>

<style scoped>
</style>