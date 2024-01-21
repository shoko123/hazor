<template>
  <AuthDialogForm :text="text">
    <template #buttons>
      <v-btn color="primary" block @click="checkIfVerified">Close (After verification)</v-btn>
    </template>
  </AuthDialogForm>
</template>

<script setup lang="ts" >
//This form is shown after registration - 
//proceed only after verification!
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../../../scripts/stores/auth'
import { useNotificationsStore } from '../../../scripts/stores/notifications'
import AuthDialogForm from './AuthDialogForm.vue'

let { email } = storeToRefs(useAuthStore())
let { userStatus, resetAndGoTo, login } = useAuthStore()
const { showSnackbar } = useNotificationsStore()

async function checkIfVerified() {
  const us = await userStatus()
  switch (us) {
    case 'verified':
      showSnackbar('Thank you for completing your email verification! You are redirected to the login page')
      resetAndGoTo('login')
      break
    case 'not-verified':
      showSnackbar("Your email has not been verified! Please check email and verify!")
      break
    default:
      showSnackbar('There was a problem accessing the server. Redirected to the home page')
      resetAndGoTo('home')
  }
}

const text = computed(() => {
  return `A verification email has been sent to "${email.value}". After verifying your email please click below to close this tab`
})
</script>


