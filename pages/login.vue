<script setup lang="ts">
import * as v from 'valibot'
import type {FormSubmitEvent} from '@nuxt/ui'
import { useAuthStore } from '~/store/auth'

const schema = v.object({
  username: v.pipe(
      v.string(),
      v.minLength(3, 'Le pseudo doit contenir au moins 3 caractères')
  ),
  password: v.pipe(
      v.string(),
      v.minLength(8, 'Le mot de passe doit contenir au moins 8 caractères')
  ),
})

type Schema = v.InferOutput<typeof schema>

const state = reactive({
  username: '',
  password: ''
})

const resetForm = () => {
  state.username = ''
  state.password = ''
}

const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
  await register()
}

// Register
const baseUrl = "https://simeon.back.dlfcaroline.com"
const toast = useToast()
const router = useRouter()
const authStore = useAuthStore()

const register = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/login_check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        username: state.username,
        password: state.password,
      })
    });

    const responseData = await res.json()

    if (!res.ok) {
      toast.add({
        title: 'Erreur lors de la connexion',
        description: responseData || 'Erreur lors de la connexion',
        color: 'error',
        duration: 5000
      })
    }else {

      toast.add({
        title: 'Connexion réussie',
        description: 'Vous êtes maintenant connecté',
        color: 'success',
        duration: 3000
      })

      authStore.setToken(responseData)
      //recup user ?

      await router.push('/')
    }

  } catch (error: any) {
    console.error(error)
    resetForm()
  }
}



</script>

<template>
  <div class="flex flex-col md:flex-row h-screen w-screen">
    <div class="left bg-primary-500 flex items-center justify-center md:w-1/2 p-8">
      <h1 class="hidden md:block md:text-2xl lg:text-3xl md:w-3/4 text-center">
        REbonjour
      </h1>
    </div>

    <!-- Partie droite (modifiée) -->
    <div class="right flex flex-col justify-center items-center md:w-1/2 p-8 md:p-12 lg:p-20">
      <div class="w-full max-w-md">
        <Logo class="hidden md:block mb-8 mx-auto" />
        <UForm
            :schema="v.safeParser(schema)"
            :state="state"
            class="space-y-6 w-full"
            @submit="handleSubmit"
        >
          <UFormField label="Username" name="username" class="w-full">
            <UInput v-model="state.username" class="w-full"/>
          </UFormField>

          <UFormField label="Password" name="password" class="w-full">
            <UInput v-model="state.password" type="password" class="w-full"/>
          </UFormField>

          <Button type="submit" class="w-full" label="Se connecter" />
        </UForm>

        <div class="mt-8 text-center">
          <p>Pas encore de compte ?</p>
          <ULink
              to="/register"
              active-class="text-primary"
              class=""
          >
            S'inscrire
          </ULink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>