<template>
  <v-btn v-if="!auth.authenticated" text @click="loginClick()">Login</v-btn>
  <v-menu v-if="auth.authenticated">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props">
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../scripts/stores/auth';

let auth = useAuthStore()
const router = useRouter()

type TypeUserOptions = "Dashboard" | "Logout"
let options: TypeUserOptions[] = ["Dashboard", "Logout"]

function loginClick() {
  router.push({ path: '/login' })
}
function userOptionsClicked(item: 'Dashboard' | 'Logout') {
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

