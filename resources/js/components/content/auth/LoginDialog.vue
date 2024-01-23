<template>
  <v-btn
    color="primary"
    block
    @click="checkIfVerified"
  >
    Continue (After verification)
  </v-btn>
</template>

<script setup lang="ts">
//This form is only shown if after login, user is found to be not verified - 
//proceed only after verification!

import { useAuthStore } from '../../../scripts/stores/auth'
import { useNotificationsStore } from '../../../scripts/stores/notifications'

let { userStatus, resetAndGoTo } = useAuthStore()
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
      showSnackbar('Server-access. Redirected to the home page')
      resetAndGoTo('home')
  }
}
</script>


