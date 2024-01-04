<template>
  <v-card dense>
    <v-toolbar :height="35">
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

      <div class="d-flex justify-center">
        <a class="text-blue text-decoration-none" @click="goToLogin()">
          To Login Page<v-icon icon="mdi-chevron-right"></v-icon>
        </a>
      </div>
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
import { useAuthStore } from '../../../scripts/stores/auth'
import { useNotificationsStore } from '../../../scripts/stores/notifications';
import { useRoutesMainStore } from '../../../scripts/stores/routes/routesMain'

let { showSnackbar } = useNotificationsStore()
let { sendResetPasswordMail } = useAuthStore()
let { routerPush } = useRoutesMainStore()
import { useVuelidate } from "@vuelidate/core"
import { required, email } from "@vuelidate/validators"

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

  let res = await sendResetPasswordMail(data)
  if (res) {
    dialog.value = true
    console.log(`Password reset email was sent successfully`)
  }
}

const waitText = computed(() => {
  return `A password reset link was emailed to "${data.email}".
  Follow instructions on email. Once a new password was set, click below to head to the login page.`
})

function goToLogin() {
  routerPush('login')
}
</script>



