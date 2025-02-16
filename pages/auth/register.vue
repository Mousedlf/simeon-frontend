<script setup lang="ts">

import type {FormError, FormSubmitEvent} from "#ui/types";

const state = reactive({
  email: undefined,
  password: undefined
})

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.email) errors.push({ path: 'email', message: 'Required' })
  if (!state.password) errors.push({ path: 'password', message: 'Required' })
  return errors
}

async function onSubmit(event: FormSubmitEvent<any>) {
  // Do something with data
  console.log(event.data)
}

</script>

<template>
  <div class="content">
    <div class="left">
      <span class="h1">Simplifiez l’organisation et le suivi de vos voyages, solo ou à plusieurs, grâce à notre interface intégrant planning interactif, gestion financière et de réservations.</span>
    </div>

    <div class="right">
      <div class="container">
        <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormGroup label="Email" name="email">
            <UInput v-model="state.email" />
          </UFormGroup>

          <UFormGroup label="Password" name="password">
            <UInput v-model="state.password" type="password" />
          </UFormGroup>

<Button label="Valider"/>
        </UForm>

        <p>Vous n'avez pas encore de compte ?</p>
        <ULink
            to="/auth/login"
            active-class="text-primary"
        >
          Créez-en un.
        </ULink>
      </div>

    </div>
  </div>

</template>

<style scoped>
.content {
  display: flex;
  height: 100vh;
  flex-direction: column;

  @media only screen and (min-width: 992px) {
    flex-direction: row;
  }

  .left, .right {
    width: 100vw;
  }

  .left{
    background-color: var(--mustard);
    color: var(--dark);
    height: 30%;

    @media only screen and (min-width: 992px) {
      height: 100%;
    }
  }
  .right {
    height: 70%;

    @media only screen and (min-width: 992px) {
      height: 100%;
    }

    .container{
      padding: 10%;
    }

  }
}


</style>