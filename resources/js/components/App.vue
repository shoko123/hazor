<!-- App.vue -->
<template>
  <v-app>
    <Snackbar />
    <LoadingSpinner />
    <Menus />
    <v-main>
      <router-view></router-view>
    </v-main>
    <v-footer />
  </v-app>
  <Modal />
</template>

<script setup lang="ts" >
import { onBeforeUnmount } from 'vue'
import Menus from './menus/Menus.vue'
import Snackbar from './notifications/snackbar.vue'
import LoadingSpinner from './notifications/loadingSpinner.vue'
import Modal from './modals/Modal.vue'
import { useXhrStore } from '../scripts/stores/xhr'

onBeforeUnmount(() => {
    const { send } = useXhrStore()
    send('auth/logout', 'post')
})
</script>