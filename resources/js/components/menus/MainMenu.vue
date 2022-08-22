<template>
  <v-app-bar :height="36" color=primary dark app>
    <v-app-bar-title>
      <v-btn :to="{ name: 'home' }">** Dig ** ({{ module.name }})</v-btn>
    </v-app-bar-title>
    <v-btn :to="{ name: 'home' }">Home</v-btn>
    <v-btn :to="{ name: 'welcome', params: { module: 'loci' } }">Loci</v-btn>
    <v-btn :to="{ name: 'welcome', params: { module: 'stones' } }">Stone</v-btn>
    <v-btn :to="{ name: 'welcome', params: { module: 'fauna' } }">Fauna </v-btn>
    <v-spacer></v-spacer>
    <LoginOrUser />
  </v-app-bar>
</template>

<script lang="ts" setup>

import LoginOrUser from './LoginOrUser.vue'
import { storeToRefs } from 'pinia'
import { useStatusStore } from '../../scripts/stores/status'

let { module } = storeToRefs(useStatusStore())

</script>

