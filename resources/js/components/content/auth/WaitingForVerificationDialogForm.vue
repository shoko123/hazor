<template>
  <v-card>
    <v-card-text>
      {{ awaitingVerificationText }}
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" block @click="maybeVerified">Finish Verification (after activation of email link)</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts" >
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../../../scripts/stores/auth'

import { useNotificationsStore } from '../../../scripts/stores/notifications';
import { useRoutesMainStore } from '../../../scripts/stores/routes/routesMain'

const props = defineProps<{
  email: string
  fromLogin: boolean
}>()

let { showSnackbar } = useNotificationsStore()
let { getUser } = useAuthStore()
let { user, emailVerificationDialog } = storeToRefs(useAuthStore())
let { routerPush } = useRoutesMainStore()

const awaitingVerificationText = computed(() => {
  return `${props.fromLogin ? `Your email has not not been verified` : ``} A verification email was sent to "${props.email}".
  Once you activated email link, click below to continue.`
})

async function maybeVerified() {
  let dbUser = await getUser()
  if (dbUser === 'unauthenticated' || dbUser === null) {
    showSnackbar('There was a problem. Redirected to the home page')
    routerPush('home')
  } else {
    if (dbUser.is_verified) {
      emailVerificationDialog.value = false
      user.value = dbUser
      showSnackbar('Thank you for completing your email verification! You are logged in and redirected to the home page')
      routerPush('home')
    } else {
      showSnackbar("Your email has not been verified! Please check email and verify!")
    }
  }
}

</script>


