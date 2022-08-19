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
</template>

<script setup lang="ts" >
import Menus from './menus/Menus.vue'
import Snackbar from './notifications/snackbar.vue'
import LoadingSpinner from './notifications/loadingSpinner.vue'

</script>