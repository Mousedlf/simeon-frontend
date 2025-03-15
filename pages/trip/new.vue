<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import Cookies from 'universal-cookie';

const config = useRuntimeConfig();
const cookies = new Cookies();
const toast = useToast();

const state = reactive({
  name: undefined,
  description: undefined,
  startDate: undefined,
  endDate: undefined,
  public: undefined
})

async function createTrip(event: FormSubmitEvent<any>) {
  try{

   const token = cookies.get('token')

    const res = await fetch(`${config.public.baseUrlApi}/trip/new`, { // authenticatedFetch
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.token}` ,
      },
      body: JSON.stringify({
        name: state.name,
        description: state.description,
        startDate: state.startDate,
        endDate: state.endDate,
      })
    });

    const responseData = await res.json()

    if(!res.ok){
      toast.add({
        title: 'Erreur lors de la creation',
        description: markRaw(responseData) || '',
        color: 'error',
        duration: 5000
      })
    } else {

      if(typeof responseData === "string"){
        toast.add({
          title: responseData || 'Nouveau voyage créé !',
          color: 'warning',
          duration: 5000
        })
      } else {
        toast.add({
          title: 'Nouveau voyage créé !',
          color: 'success',
          duration: 5000
        })
        stepper.value?.next();
      }

    }

  }catch(error){
    console.log("catch", error)
  }
}

const items = ref([
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
const value = ref(items.value[0]?.value)

const avatar = computed(() => items.value.find(item => item.value === value.value)?.avatar)

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

</script>

<template>
  <div class="h-screen">
    <Subheader
        title="Créer un nouveau voyage">
      <slot>
      </slot>
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
            <UFormField label="Nom" name="name">
              <UInput v-model="state.name" type="text" class="w-full" />
            </UFormField>

            <UFormField label="Description" name="description">
              <UTextarea v-model="state.description" type="text" :rows="4" class="w-full"/>
            </UFormField>

            <div class="flex gap-4">
              <UFormField label="Date de début" name="startDate">
                <UInput v-model="state.startDate" type="date" />
              </UFormField>

              <UFormField label="Date de fin" name="endDate">
                <UInput v-model="state.endDate" type="date" />
              </UFormField>

<!--              // https://ui.nuxt.com/components/calendar#as-a-daterangepicker-->
            </div>

            <UFormField name="public">
              <USwitch
                  unchecked-icon="i-lucide-x"
                  checked-icon="i-lucide-check"
                  default-value
                  label="Voyage privé"
                  v-model="state.public"
              />
            </UFormField>

            <Button type="submit" label="Enregistrer et passer à la prochaine étape" class="mt-10"/>

          </UForm>
        </div>

      </template>

        <template #second>
          <div class="ml-8">

          <p>ajout personnes</p>
            <UInputMenu multiple :items="items" delete-icon="i-lucide-trash" /> <!--  et v-model -->
          </div>

          <UButton label="Ajouter plus tard" variant="outline" />
          <UButton label="Enregistrer" />
        </template>

      </UStepper>

    </UContainer>

  </div>


</template>

<style scoped>

</style>