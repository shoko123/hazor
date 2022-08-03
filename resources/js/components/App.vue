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
import { onBeforeMount } from 'vue'
import MainMenu from './menus/MainMenu.vue'
import SubMenu from './menus/SubMenu.vue'
import Snackbar from './notifications/snackbar.vue'
import LoadingSpinner from './notifications/loadingSpinner.vue'
import { useXhrStore } from '../scripts/stores/xhr'
import { useMainStore } from '../scripts/stores/main'

let xhr = useXhrStore()
let main = useMainStore()

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

onBeforeMount(() => {
  console.log("App.onMounted()");
  let baseUrl = `${window.location.protocol}//${window.location.host}`;
  console.log("app.init() setting axios.baseURL to " + baseUrl);
  xhr.setBaseUrl(baseUrl);
  //console.log(`axios: ${JSON.stringify(axios, null, 2)}`);
  xhr.send('app/init', 'get')
    .then(res => {
      main.bucketUrl = res.data.bucketUrl
      main.accessibility = res.data.accessibility
    })
    .catch(err => {
      console.log(`app/init failed with error: ${err}`)
      throw ("app.init() failed")
    })
})

</script>