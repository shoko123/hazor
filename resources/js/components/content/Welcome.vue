<template>
  <v-img id="img" :src="backgroundImage?.fullUrl" :lazy-src="backgroundImage?.tnUrl" :cover="true">
    <v-card width="30%" height="100%" flat color="rgb(255, 0, 0, 0)" class="opac">
      <v-card-title class="title text-white text-h4">{{ module }} Welcome Page</v-card-title>
      <v-card-text class="white--text text-h5">
        <v-container fluid>
          <v-row class="mb-4 mt-4">
            Record Count: {{ counts.items }}
          </v-row>
          <v-row class="mb-4">
            Media Count: {{ counts.media }}
          </v-row>
          <v-row>
            <v-textarea auto-grow class="font-weight-bold" v-model="welcomeText"> </v-textarea>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>


  </v-img>
</template>

<script lang="ts" setup>

import { onMounted, onUnmounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useModuleStore } from '../../scripts/stores/module'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'

let { current } = storeToRefs(useRoutesMainStore())
const { backgroundImage, counts, welcomeText } = storeToRefs(useModuleStore())

const module = computed(() => {
  return current.value.module
})



</script>

<style scoped>
#img {
  height: 100vh;
}

.opac {
  background-color: rgba(92, 19, 19, 0.4) !important;
  border-color: white !important;
}
</style>