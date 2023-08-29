<template>
  <v-app-bar-title>
    <v-btn :to="{ name: 'home' }">Hazor ({{ module }})</v-btn>
  </v-app-bar-title>
  <v-btn :to="{ name: 'home' }">Home</v-btn>
  <v-btn :disabled="disableLinks" :to="{ name: 'welcome', params: { module: 'loci' } }">Loci</v-btn>
  <v-btn :disabled="disableLinks" :to="{ name: 'welcome', params: { module: 'stones' } }">Stone</v-btn>
  <v-btn :disabled="disableLinks" :to="{ name: 'welcome', params: { module: 'fauna' } }">Fauna </v-btn>
  <v-spacer />
  <LoginOrUser />
</template>

<script lang="ts" setup>

import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import LoginOrUser from './LoginOrUser.vue'
import { useRoutesMainStore } from '../../../../scripts/stores/routes/routesMain'
import { useAuthStore } from '../../../../scripts/stores/auth'

const { current } = storeToRefs(useRoutesMainStore())
const { authenticated, accessibility } = storeToRefs(useAuthStore())

const module = computed(() => {
  return current.value.module
})

const disableLinks = computed(() => {
  return accessibility.value.authenticatedUsersOnly && !authenticated.value
})
</script>

