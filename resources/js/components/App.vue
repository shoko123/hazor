<!-- App.vue -->
<template>
  <v-app>
    <Snackbar />
    <LoadingSpinner />
    <Menus/>
    <v-main>
       <router-view></router-view>
      <!-- <v-container fluid class="ma-0 pa-0">
        <router-view></router-view>
      </v-container> -->
    </v-main>
    <v-footer />
  </v-app>
</template>

<script setup lang="ts" >
import { defineComponent } from 'vue'
import Menus from './menus/Menus.vue'
import Snackbar from './notifications/snackbar.vue'
import LoadingSpinner from './notifications/loadingSpinner.vue'


defineComponent({
  name: "App",
  components: {
    Menus,
    // Footer,
    Snackbar,
    LoadingSpinner
    // MediaLightBox
  },
});
</script>