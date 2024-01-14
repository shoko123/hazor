<template>
  <v-card dense>
    <v-toolbar :height="35">
      <v-toolbar-title>User Registration Form</v-toolbar-title>
    </v-toolbar>
    <v-card-text class="pa-12 pb-8">

      <div class="text-subtitle-1 text-medium-emphasis">User Name</div>

      <v-text-field v-model="data.name" :error-messages="nameErrors" density="compact" placeholder="Enter user name"
        prepend-inner-icon="mdi-account" variant="outlined"></v-text-field>


      <div class="text-subtitle-1 text-medium-emphasis">Email</div>

      <v-text-field v-model="data.email" :error-messages="emailErrors" density="compact" placeholder="Email address"
        prepend-inner-icon="mdi-email-outline" variant="outlined"></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Password
      </div>

      <v-text-field v-model="data.password" :error-messages="passwordErrors"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'" density="compact"
        placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline" variant="outlined"
        @click:append-inner="visible = !visible"></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Password Confirmation
      </div>

      <v-text-field v-model="data.password_confirmation" :error-messages="password_confirmationErrors"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'" density="compact"
        placeholder="Enter password confirmation" prepend-inner-icon="mdi-lock-outline" variant="outlined"
        @click:append-inner="visible = !visible"></v-text-field>

      <v-btn @click="register1" block class="mb-8" color="blue" size="large" variant="tonal">
        Register
      </v-btn>

      <div class="d-flex justify-center">
        <a class="text-blue text-decoration-none" @click="goToLogin">
          To Login Page<v-icon icon="mdi-chevron-right"></v-icon>
        </a>
      </div>
    </v-card-text>
  </v-card>

  <v-dialog v-model="emailVerificationDialog" persistent width="500">
    <WaitingForVerificationDialogForm :email="data.email" :fromLogin="false"> </WaitingForVerificationDialogForm>
  </v-dialog>
</template>

<script setup lang="ts" >
import { computed, ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../../../scripts/stores/auth'
import { useNotificationsStore } from '../../../scripts/stores/notifications';
import { useRoutesMainStore } from '../../../scripts/stores/routes/routesMain'
import { useXhrStore } from '../../../scripts/stores/xhr'

import WaitingForVerificationDialogForm from './WaitingForVerificationDialogForm.vue'

let { showSnackbar } = useNotificationsStore()
let { register } = useAuthStore()
let { emailVerificationDialog } = storeToRefs(useAuthStore())
let { routerPush } = useRoutesMainStore()

import { useVuelidate } from "@vuelidate/core"
import { required, email, minLength, maxLength, helpers, sameAs, } from "@vuelidate/validators"

const data = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
})

const rules = computed(() => {
  return {
    name: { required, minValue: minLength(4), maxValue: maxLength(40), },
    email: { required, email },
    password: {
      required,
      minLength: minLength(8),
      containsPasswordRequirement: helpers.withMessage(
        () => `The password requires an uppercase, lowercase, and a number`,
        (value) => /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(<string>value)
      ),
    },//no need for validation - from select 
    password_confirmation: { required, sameAsPassword: sameAs(data.password) }
  }
})

const v$ = useVuelidate(rules, data)

const nameErrors = computed(() => {
  return <string>(v$.value.name.$error ? v$.value.name.$errors[0].$message : undefined)
})

const emailErrors = computed(() => {
  return <string>(v$.value.email.$error ? v$.value.email.$errors[0].$message : undefined)
})

const passwordErrors = computed(() => {
  return <string>(v$.value.password.$error ? v$.value.password.$errors[0].$message : undefined)
})

const password_confirmationErrors = computed(() => {
  return <string>(v$.value.password_confirmation.$error ? v$.value.password_confirmation.$errors[0].$message : undefined)
})

const visible = ref(false)


async function register1() {
  console.log(`register...`)

  await v$.value.$validate();
  if (v$.value.$error || v$.value.$silentErrors.length > 0) {
    showSnackbar("Please correct the marked errors!", "orange")
    console.log(`validation errors: ${JSON.stringify(v$.value.$errors, null, 2)} silent: ${JSON.stringify(v$.value.$silentErrors, null, 2)}`)
    return
  }


  let res = await register(data)
  if (res) {
    emailVerificationDialog.value = true
  }
}



function goToLogin() {
  routerPush('login')
}

</script>


