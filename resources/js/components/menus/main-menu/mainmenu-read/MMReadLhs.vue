<template>
  <v-btn :to="{ name: 'home' }">Hazor ({{ module }})</v-btn>
  <v-divider class="ms-3" inset vertical></v-divider>
  <div class="hidden-sm-and-down">
    <v-btn :disabled="disableLinks" :to="{ name: 'welcome', params: { module: 'loci' } }">Loci</v-btn>
    <v-btn :disabled="disableLinks" :to="{ name: 'welcome', params: { module: 'stones' } }">Stones</v-btn>
    <v-btn :disabled="disableLinks" :to="{ name: 'welcome', params: { module: 'fauna' } }">Fauna</v-btn>
  </div>
</template>

<script lang="ts" setup>

import { computed } from 'vue'
import { storeToRefs } from 'pinia'
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

