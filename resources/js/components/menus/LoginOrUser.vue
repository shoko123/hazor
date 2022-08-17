<template>
  <v-btn v-if="showLoginButton" text @click="loginClick()">Login</v-btn>
  <v-menu v-if="auth.authenticated">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props">
      <v-icon left dark>mdi-account</v-icon>
        {{ auth.user?.name }}
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(item, index) in options" :key="index" :value="index" @click="userOptionsClicked(item)">
        <v-list-item-title>{{ item }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../scripts/stores/auth';
import { useStatusStore} from '../../scripts/stores/status';
import type { TName } from '../../types/routesTypes'
let auth = useAuthStore()
let { authenticated} = storeToRefs(auth)
const router = useRouter()
let { routeName } = storeToRefs(useStatusStore())

type TUserOption = 'Dashboard' | 'Logout'

let options: TUserOption[] = ['Dashboard', 'Logout']

const showLoginButton = computed(() => {
return !authenticated.value && String(routeName.value) !== 'login'
})

function loginClick() {
  router.push({ path: '/auth/login' })
}
function userOptionsClicked(item: TUserOption) {
  switch (item) {
    case "Logout":
      auth.logout()
      break;
    case "Dashboard":
      console.log("Dashboard clicked")
      break;
  }
}

</script>

