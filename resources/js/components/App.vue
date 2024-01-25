<!-- App.vue -->
<template>
  <v-app>
    <SnackBar />
    <LoadingSpinner />
    <MenusBoth />
    <v-main>
      <router-view />
    </v-main>
    <v-footer />
  </v-app>
  <Modal />
</template>

<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import MenusBoth from './menus/MenusBoth.vue'
import SnackBar from './notifications/SnackBar.vue'
import LoadingSpinner from './notifications/loadingSpinner.vue'
import Modal from './modals/Modal.vue'
import { useXhrStore } from '../scripts/stores/xhr'

onBeforeUnmount(() => {
    const { send } = useXhrStore()
    send('fortify/logout', 'post')
})
</script>