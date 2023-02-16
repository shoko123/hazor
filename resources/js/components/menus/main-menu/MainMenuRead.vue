<template>
    <v-app-bar-title>
      <v-btn :to="{ name: 'home' }">** Dig ** ({{ name }})</v-btn>
    </v-app-bar-title>
    <v-btn :to="{ name: 'home' }">Home</v-btn>
    <v-btn :to="{ name: 'welcome', params: { module: 'loci' } }">Loci</v-btn>
    <v-btn :to="{ name: 'welcome', params: { module: 'stones' } }">Stone</v-btn>
    <v-btn :to="{ name: 'welcome', params: { module: 'fauna' } }">Fauna </v-btn>
    <v-spacer></v-spacer>
    <LoginOrUser />

</template>

<script lang="ts" setup>

import { computed } from 'vue'
import LoginOrUser from './LoginOrUser.vue'
import { storeToRefs } from 'pinia'
import { useRoutesMainStore } from '../../../scripts/stores/routes/routesMain'

let { getModule } = useRoutesMainStore()
const name = computed(() => {
    return getModule()
})
</script>

