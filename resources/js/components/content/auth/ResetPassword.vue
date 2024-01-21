<template>
  <template v-if="isUnauthinticated">
    <div class="text-subtitle-1 text-medium-emphasis">Email</div>
    <v-text-field v-model="data.email" readonly :error-messages="emailErrors" density="compact"
      placeholder="Email address" prepend-inner-icon="mdi-email-outline" variant="outlined"></v-text-field>

    <v-text-field v-model="data.password" :error-messages="passwordErrors"
      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'" density="compact"
      placeholder="Enter your new password" prepend-inner-icon="mdi-lock-outline" variant="outlined"
      @click:append-inner="visible = !visible"></v-text-field>

    <v-text-field v-model="data.password_confirmation" :error-messages="password_confirmationErrors"
      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'" density="compact"
      placeholder="Enter new password confirmation" prepend-inner-icon="mdi-lock-outline" variant="outlined"
      @click:append-inner="visible = !visible"></v-text-field>

    <v-btn @click="send" block class="mb-8" color="blue" size="large" variant="tonal">
      Reset Password
    </v-btn>
  </template>
  <template v-else>
    <div class="text-h4">{{ problemText }}</div>
    <v-btn @click="closeTab" block class="mb-8" color="blue" size="large" variant="tonal">
      Close Tab
    </v-btn>
  </template>
</template>

<script setup lang="ts" >
import { computed, ref, reactive, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../../../scripts/stores/auth'
import { useNotificationsStore } from '../../../scripts/stores/notifications';
import { useVuelidate } from "@vuelidate/core"
import { required, email, minLength, helpers, sameAs, maxValue } from "@vuelidate/validators"

onMounted(() => {
  prefetch()
  const route = useRoute()
  data.email = <string>route.query.email
  data.token = <string>route.params.slug
  console.log(`ResetPasswordForm data:\n ${JSON.stringify(data, null, 2)}`)
})

let { showSnackbar } = useNotificationsStore()
let { attemptResetPassword, userStatus } = useAuthStore()

const visible = ref(false)
const uStat = ref<'verified' | 'not-verified' | 'server-error' | 'unauthenticated'>('unauthenticated')

const data = reactive({
  email: "",
  password: "",
  password_confirmation: "",
  token: ""
})

async function prefetch() {
  uStat.value = await userStatus()
  //console.log(`ResetPwdFrm.prefetch() res: ${JSON.stringify(uStat, null, 2)}`)
}

const rules = computed(() => {
  return {
    email: { required, email },
    password: {
      required,
      minLength: minLength(8),
      containsPasswordRequirement: helpers.withMessage(
        () => `The password requires an uppercase, lowercase, and a number`,
        (value) => /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(<string>value)
      ),
    },
    password_confirmation: { required, sameAsPassword: sameAs(data.password) },
    token: { required }
  }
})

const v$ = useVuelidate(rules, data)

const emailErrors = computed(() => {
  return <string>(v$.value.email.$error ? v$.value.email.$errors[0].$message : undefined)
})

const passwordErrors = computed(() => {
  return <string>(v$.value.password.$error ? v$.value.password.$errors[0].$message : undefined)
})

const password_confirmationErrors = computed(() => {
  return <string>(v$.value.password_confirmation.$error ? v$.value.password_confirmation.$errors[0].$message : undefined)
})

async function send() {
  await v$.value.$validate()
  if (v$.value.$error || v$.value.$silentErrors.length > 0) {
    showSnackbar("Please correct the marked errors!", "orange")
    console.log(`validation errors: ${JSON.stringify(v$.value.$errors, null, 2)} silent: ${JSON.stringify(v$.value.$silentErrors, null, 2)}`)
    return
  }

  let res = await attemptResetPassword(data)
}

async function closeTab() {
  window.close()
}

const isUnauthinticated = computed(() => {
  return uStat.value === 'unauthenticated'
})

const problemText = computed(() => {
  switch (uStat.value) {
    case 'server-error':
      return 'There was a problem accessing the server. Please close this tab and try later'
    case 'verified':
    case 'not-verified':
      return `You are currently logged in and therefore can't reset your password.\
  Please close this tab and log out of the application before clicking the email verification link in your email.`
    default:
      return ''
  }
})
</script>


