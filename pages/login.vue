<script lang="ts" setup>
import * as v from 'valibot'
import type {FormSubmitEvent} from '@nuxt/ui'
import {useAuthStore} from '~/store/auth'

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
  await login()
}

const validate = (formState: Schema) => {
  const result = v.safeParse(schema, formState);
  if (result.success) {
    return [];
  }

  return result.issues.map(issue => ({
    path: issue.path[0]?.key,
    message: issue.message
  }));
};

const baseUrl = "https://apisimeon.dlfcaroline.com";
const toast = useToast();
const router = useRouter();
const authStore = useAuthStore();
const config = useRuntimeConfig();

const login = async () => {
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
    } else {

      toast.add({
        title: 'Connexion réussie',
        description: 'Vous êtes maintenant connecté',
        color: 'success',
        duration: 3000
      })

      authStore.setToken(responseData.token)

      try {
        const res = await fetch(`${config.public.baseUrlApi}/user/profile`, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + responseData.token,
          },
        });

        if (res.ok) {
          const userData = await res.json();
          authStore.setCurrentUser(userData)
        }
      } catch (error) {
        console.error(error);
        return null;
      }
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
      <h1 class="hidden md:block md:text-2xl lg:text-3xl md:w-3/4">
        Votre prochaine aventure vous attend. Connectez-vous pour y accéder.
      </h1>
    </div>

    <div class="right flex flex-col justify-center items-center md:w-1/2 p-8 md:p-12 lg:p-20">
      <div class="w-full max-w-md">
        <Logo class="hidden md:block mb-8 mx-auto"/>
        <UForm
            :validate="validate" :state="state"
            class="space-y-6 w-full"
            @submit="handleSubmit"
        >
          <UFormField class="w-full" label="Username" name="username">
            <UInput v-model="state.username" class="w-full"/>
          </UFormField>

          <UFormField class="w-full" label="Password" name="password">
            <UInput v-model="state.password" class="w-full" type="password"/>
          </UFormField>

          <UButton class="w-full" label="Se connecter" type="submit"/>
        </UForm>

        <div class="mt-8 text-center">
          <p>Pas encore de compte ?</p>
          <ULink
              active-class="text-primary"
              class=""
              to="/register"
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