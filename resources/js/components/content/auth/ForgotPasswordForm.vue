<template>
  <v-card class="mx-auto" elevation="8" max-width="448" rounded="lg">
    <v-toolbar dark color="primary" density="compact" :height="50">
      <v-toolbar-title>Forgot Password Form</v-toolbar-title>
    </v-toolbar>
    <v-card-text class="pa-12 pb-8">
      <div class="text-subtitle-1 text-medium-emphasis">Recovery Email</div>

      <v-text-field v-model="data.email" :error-messages="emailErrors" density="compact" placeholder="Email address"
        prepend-inner-icon="mdi-email-outline" variant="outlined">
      </v-text-field>

      <v-btn @click="send" block class="mb-8" color="blue" size="large" variant="tonal">
        Send Email
      </v-btn>

    </v-card-text>
  </v-card>
  <v-dialog v-model="dialog" persistent width="500">
    <v-card>
      <v-card-text>
        {{ waitText }}
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="goToLogin">Go to Login (after activation of email reset link)</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts" >
import { computed, ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../../../scripts/stores/auth'
import { useNotificationsStore } from '../../../scripts/stores/notifications';
import { useRoutesMainStore } from '../../../scripts/stores/routes/routesMain'
import { router } from '../../../scripts/setups/vue-router'

let { showSpinner, showSnackbar } = useNotificationsStore()
let auth = useAuthStore()
let { current } = storeToRefs(useRoutesMainStore())
let { routerPush } = useRoutesMainStore()
import { useVuelidate } from "@vuelidate/core"
import { required, email, minLength, helpers, sameAs, maxValue } from "@vuelidate/validators"

const dialog = ref(false)
const data = reactive({
  email: "",
})

const rules = computed(() => {
  return {
    email: { required, email },
  }
})

const v$ = useVuelidate(rules, data)

const emailErrors = computed(() => {
  return <string>(v$.value.email.$error ? v$.value.email.$errors[0].$message : undefined)
})

async function send() {
  await v$.value.$validate();
  console.log(`after validate() errors: ${JSON.stringify(v$.value.$errors, null, 2)}`)
  if (v$.value.$error || v$.value.$silentErrors.length > 0) {
    showSnackbar("Please correct the marked errors!", "orange")
    console.log(`validation errors: ${JSON.stringify(v$.value.$errors, null, 2)}`)
    console.log(`validation silent errors: ${JSON.stringify(v$.value.$silentErrors, null, 2)}`)
    return
  }

  let res = await auth.sendResetPasswordMail(data)

  if (res) {
    //showSnackbar('Successfully logged-in!')
    console.log(`SendPasswordEmail request returned`)
    showSnackbar('SendPasswordEmail returned')
  } else {
    showSnackbar('SendPasswordEmail failed ******')
    console.log(`SendPasswordEmail failed ******`)
  }

}

const waitText = computed(() => {
  return `A password reset link was emailed to "${data.email}".
  Follow instructions on email. Once a new password was set, click below to continue.`
})

function goToRegister() {
  routerPush('register')
}

function goToLogin() {
  routerPush('login')
}
</script>
<style scoped>
#img {
  height: 91vh;
}
</style>


