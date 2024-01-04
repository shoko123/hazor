<template>
  <template v-if="showFullPage">
    <component :is="form" />
  </template>
  <template v-else>
    <v-img style="height:95vh" :src="backgroundImage?.fullUrl" :lazy-src="backgroundImage?.tnUrl" :cover="true">
      <v-container fluid pa-0>
        <v-row justify="center" style="height:100vh" dense>
          <v-col md="5" class="grey-lighten-2 fill-height d-flex flex-column justify-center">
            <component :is="form" />
          </v-col>
        </v-row>
      </v-container>
    </v-img>
  </template>
</template>

<script setup lang="ts" >
import { computed, type Component } from 'vue'
import { storeToRefs } from 'pinia'
import { useDisplay } from 'vuetify'
import { useModuleStore } from '../../../scripts/stores/module'
import { useRoutesMainStore } from '../../../scripts/stores/routes/routesMain'

import LoginForm from './Login.vue'
import RegistrationForm from './Registration.vue'
import ForgotPasswordForm from './ForgotPasswordForm.vue'
import ResetPasswordForm from './ResetPasswordForm.vue'
const { backgroundImage } = storeToRefs(useModuleStore())
const { current } = storeToRefs(useRoutesMainStore())
const { smAndDown } = useDisplay()

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

const showFullPage = computed(() => {
  return smAndDown.value
})

</script>



