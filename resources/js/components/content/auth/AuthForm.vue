<template>
  <v-card dense>
    <v-toolbar :height="35">
      <v-toolbar-title> {{ parts?.header }}</v-toolbar-title>
    </v-toolbar>
    <v-card-text class="pa-12 pb-8">
      <slot name="form">
        <component :is="parts?.form" />
      </slot>
    </v-card-text>
  </v-card>
  <v-dialog v-model="authDialog" persistent width="500">
    <component :is="parts?.dialogForm" />
  </v-dialog>
</template>

<script setup lang="ts" >
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../../../scripts/stores/auth'
import { useRoutesMainStore } from '../../../scripts/stores/routes/routesMain'
import LoginForm from './Login.vue'
import LoginDialog from './LoginDialog.vue'
import RegistrationForm from './Registration.vue'
import RegistrationDialog from './RegistrationDialog.vue'
import ForgotPassword from './ForgotPassword.vue'
import ForgotPasswordDialog from './ForgotPasswordDialog.vue'
import ResetPassword from './ResetPassword.vue'
import ResetPasswordDialog from './ResetPasswordDialog.vue'
const { authDialog } = storeToRefs(useAuthStore())
const { current } = storeToRefs(useRoutesMainStore())

onMounted(() => {
  authDialog.value = false
})

const parts = computed(() => {
  switch (current.value.name) {
    case 'login':
      return { form: LoginForm, header: `User Login Form`, dialogForm: LoginDialog }

    case 'register':
      return { form: RegistrationForm, header: `User Registration Form`, dialogForm: RegistrationDialog }

    case 'forgot-password':
      return { form: ForgotPassword, header: `Forgot Password Form`, dialogForm: ForgotPasswordDialog }

    case 'reset-password':
      return { form: ResetPassword, header: `Reset Password Form`, dialogForm: ResetPasswordDialog }

    default:
      //console.log(`Collection.vue invalid authForm: ${current.value.name}`)
      return null
  }
})

</script>



