<template>
  <v-img id=img :src="backgroundImage?.fullUrl" :lazy-src="backgroundImage?.tnUrl" :cover="true">
    <v-container fill-height fluid>
      <v-row align="center" justify="center">
        <v-col>
          <component :is="form" />
        </v-col>
      </v-row>
    </v-container>
  </v-img>
</template>

<script setup lang="ts" >
import { computed, type Component } from 'vue'
import { storeToRefs } from 'pinia'

import { useModuleStore } from '../../../scripts/stores/module'
import { useRoutesMainStore } from '../../../scripts/stores/routes/routesMain'

import LoginForm from './Login.vue'
import RegistrationForm from './Registration.vue'
import ForgotPasswordForm from './ForgotPasswordForm.vue'
import ResetPasswordForm from './ResetPasswordForm.vue'
let { backgroundImage } = storeToRefs(useModuleStore())
let { current, inTransition } = storeToRefs(useRoutesMainStore())

const form = computed<Component | null>(() => {
  switch (current.value.name) {
    case 'login':
      return LoginForm

    case 'register':
      return RegistrationForm

    case 'forgot-password':
      return ForgotPasswordForm

    case 'reset-password':
      return ResetPasswordForm
      
    default:
      //console.log(`Collection.vue invalid authForm: ${current.value.name}`)
      return null
  }
})

</script>
<style scoped>
#img {
  height: 91vh;
}
</style>


