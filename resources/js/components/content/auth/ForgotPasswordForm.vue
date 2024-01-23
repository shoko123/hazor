<template>
  <div class="text-subtitle-1 text-medium-emphasis">
    Recovery Email
  </div>

  <v-text-field
    v-model="data.email"
    :error-messages="emailErrors"
    density="compact"
    placeholder="Email address"
    prepend-inner-icon="mdi-email-outline"
    variant="outlined"
  />

  <v-btn
    block
    class="mb-8"
    color="blue"
    size="large"
    variant="tonal"
    @click="send"
  >
    Send Email
  </v-btn>

  <div class="d-flex justify-center">
    <a
      class="text-blue text-decoration-none"
      @click="goToLogin()"
    >
      To Login Page<v-icon icon="mdi-chevron-right" />
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useAuthStore } from '../../../scripts/stores/auth'
import { useNotificationsStore } from '../../../scripts/stores/notifications'

let { showSnackbar } = useNotificationsStore()
let { attemptForgotPassword, resetAndGoTo } = useAuthStore()

import { useVuelidate } from "@vuelidate/core"
import { required, email } from "@vuelidate/validators"

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
    //console.log(`validation errors: ${JSON.stringify(v$.value.$errors, null, 2)} silent: ${JSON.stringify(v$.value.$silentErrors, null, 2)}`)
    return
  }

  await attemptForgotPassword(data)
}

function goToLogin() {
  resetAndGoTo('login')
}
</script>



