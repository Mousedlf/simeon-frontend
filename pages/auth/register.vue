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

    <div class="left bg-primary-100 flex align-center justify-center">
      <h1>Simplifiez l’organisation et le suivi de vos voyages, solo ou à plusieurs, grâce à notre interface intégrant planning interactif, gestion financière et de réservations.</h1>
    </div>

    <div class="right">


        <p>Vous n'avez pas encore de compte ?</p>
        <ULink
            to="/auth/login"
            active-class="text-primary"
        >
          Créez-en un.
        </ULink>


    </div>
  </div>

</template>

<style scoped>
.content {
  display: flex;
  flex-direction: column;

  @media only screen and (min-width: 992px) {
    flex-direction: row;
  }

  .left, .right {
    width: 100vw;
  }

}


</style>