<script lang="ts" setup>

const selectDivideItems = ref(['Diviser', 'Ne pas diviser'])
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
const currencies = ['€ (euro)', '$ (dollar)']

const categories = [
  {icon: 'ic-baseline-directions-car-filled', name: 'Transport'},
  {icon: 'ic-baseline-food-bank', name: 'Restaurant'},
  {icon: 'ic-baseline-fastfood', name: 'Café'},
  {icon: 'i-maki:bar', name: 'Boissons'},
  {icon: 'ic-baseline-museum', name: 'Musée'},
  {icon: 'ic-round-location-on', name: 'Activité'},
  {icon: 'ic:outline-shopping-cart', name: 'Shopping'},
  {icon: 'ic-baseline-shopping-cart', name: 'Courses'},
  {icon: 'ic-baseline-cleaning-services', name: 'Nettoyage'},
  {icon: 'ic-baseline-house', name: 'Hôtel'},
  {icon: 'ic-baseline-airplanemode-active', name: 'Vol'},
  {icon: 'ic-baseline-local-cafe', name: 'Caffé'},
  {icon: 'streamline-ultimate:accounting-coins', name: 'retrait'},
  {icon: 'fluent:animal-turtle-16-filled', name: 'autre'},
]
</script>


<template>
  <UContainer class="py-6">
    <div class="mb-4">
      <UButton
          icon="i-lucide-arrow-left"
          label="Retour"
          variant="link"
          @click="$router.back()"
      />
    </div>
    <h1 class="text-xl font-semibold mb-6">Ajouter une dépense</h1>
    <div class="grid gap-6 md:grid-cols-2">

      <!-- Colonne gauche -->
      <div class="space-y-4">
        <UFormField label="Montant" name="amount" required>
          <UButtonGroup class="border-2 border-primary-500 rounded-lg">
            <UInput
                class="text-2xl font-semibold"
                placeholder="0.00"
                size="xl"
                variant="none"
            >
            </UInput>

            <USelectMenu :items="currencies" variant="none" default-value="€ (euro)"/> <!-- value-attribute -->
          </UButtonGroup>
        </UFormField>

        <UFormField label="Payé par" name="paidBy" required>
          <UInputMenu :items="items" delete-icon="i-lucide-trash"/>
        </UFormField>

        <UFormField label="Diviser facture avec" name="divide">
          <UInputMenu :items="items" delete-icon="i-lucide-trash" multiple/>
        </UFormField>

        <UFormField label="Date" name="date">
          <UInput type="date"/>
        </UFormField>

        <UFormField label="Lieu" name="place">
          <UInput placeholder="ex. Supermarché, restaurant..."/>
        </UFormField>
      </div>

      <!-- Colonne droite -->
      <div class="space-y-4">
        <UFormField label="Catégorie">
          <div class="grid grid-cols-5 gap-2 border-blue-500">
            <UButton
                v-for="category in categories"
                class="flex flex-col items-center justify-center h-20 "
                size="md"
                variant="soft"
            >
              <Icon class="w-6 h-6" :name="category.icon" />
              <span class="text-sm">{{ category.name }}</span>
            </UButton>

          </div>
        </UFormField>


        <UFormField label="Note">
          <UInput placeholder="Ajouter une note facultative..."/>
        </UFormField>
      </div>
    </div>

    <!-- soumission -->
    <div class="mt-8">
      <UButton
          class="w-full md:w-auto"
          color="primary"
          icon="i-lucide-check-circle"
          label="Ajouter la dépense"
          size="lg"
      />
    </div>
  </UContainer>
</template>


<style scoped>

</style>