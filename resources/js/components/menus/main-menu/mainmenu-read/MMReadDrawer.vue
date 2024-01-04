<template>
  <v-list-item :disabled="disableLinks" :to="{ name: 'welcome', params: { module: 'loci' } }">loci</v-list-item>
  <v-list-item :disabled="disableLinks" :to="{ name: 'welcome', params: { module: 'stones' } }">stones</v-list-item>
  <v-list-item :disabled="disableLinks" :to="{ name: 'welcome', params: { module: 'fauna' } }">fauna</v-list-item>
  <div v-if="!authenticated">
    <v-list-item :to="{ name: 'login', params: { module: 'auth' } }">login</v-list-item>
  </div>
  <div v-else>
    <v-list-item @click="logoutClicked">logout</v-list-item>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../../../../scripts/stores/auth'

const { authenticated, accessibility } = storeToRefs(useAuthStore())
const { logout } = useAuthStore()

function logoutClicked() {
  logout()
}

const disableLinks = computed(() => {
  return accessibility.value.authenticatedUsersOnly && !authenticated.value
})
</script>

