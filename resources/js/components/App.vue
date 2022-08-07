<!-- App.vue -->
<template>
  <v-app>
    <Snackbar />
    <LoadingSpinner />
    <MainMenu />
    <SubMenu />
    <v-main>
      <v-container fluid class="ma-0 pa-0">
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts" >
import { defineComponent } from "vue"
import MainMenu from './menus/MainMenu.vue'
import SubMenu from './menus/SubMenu.vue'
import Snackbar from './notifications/snackbar.vue'
import LoadingSpinner from './notifications/loadingSpinner.vue'

defineComponent({
  name: "App",
  components: {
    MainMenu,
    SubMenu,
    // Footer,
    Snackbar,
    LoadingSpinner
    // MediaLightBox
  },
});
</script>