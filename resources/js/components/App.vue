<!-- App.vue -->
<template>
  <v-app>
    <!-- <MenuMain /> -->
    <MenuMain />
    <!-- Sizes your content based upon application components -->
    <v-main>

      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script setup lang="ts" >
import { defineComponent } from "vue";
import MenuMain from './menus/MenuMain.vue'

import { useXhrStore } from '../scripts/stores/xhr';



import { onBeforeMount } from 'vue'
let xhr = useXhrStore()



defineComponent({
  name: "App",
  components: {
    MenuMain,
    // Footer,
    // LoadingSpinner,
    // Snackbar,
    // MediaLightBox
  },



});
onBeforeMount(() => {
  console.log("App.onMounted()");
  let baseUrl = `${window.location.protocol}//${window.location.host}`;
  console.log("app.init() setting axios.baseURL to " + baseUrl);
  xhr.setBaseUrl(baseUrl);
  //console.log(`axios: ${JSON.stringify(axios, null, 2)}`);
  
  //dispatch("mgr/initApp", null, { root: true });
  //load global settings and load media used by app
  xhr.send({endpoint: "app/init", method: "get", data: null})
})
</script>