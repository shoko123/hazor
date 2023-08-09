<template>
  <v-btn v-if="showLoginButton" @click="loginClick()">Login</v-btn>
  <v-btn v-if="auth.authenticated">
    <v-icon left dark>mdi-account</v-icon>
    {{ auth.user?.name }}
    <v-menu activator="parent">
      <v-list>
        <v-list-item v-for="(item, index) in options" :key="index" :value="index" @click="userOptionsClicked(item)">
          <v-list-item-title>{{ item }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-btn>
</template>


<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../../scripts/stores/auth';
import { useRoutesMainStore } from '../../../../scripts/stores/routes/routesMain';
import { storeToRefs } from 'pinia'

type TUserOption = 'Dashboard' | 'Logout'

let auth = useAuthStore()
const router = useRouter()
let { current } = storeToRefs(useRoutesMainStore())

let options: TUserOption[] = ['Dashboard', 'Logout']

const showLoginButton = computed(() => {
  return !auth.authenticated && current.value.name !== 'login'
})

function loginClick() {
  router.push({ name: 'login', params: { module: 'auth' } })
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

