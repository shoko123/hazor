<template>
  <v-img id="img" :src="backgroundImage?.fullUrl" :lazy-src="backgroundImage?.tnUrl" :cover="true">
    <v-card width="30%" height="100%" flat color="rgb(255, 0, 0, 0)" class="opac">
      <v-card-title class="title text-white text-h4">{{ module }} Welcome Page</v-card-title>
      <v-card-text class="white--text text-h5">
        <v-row wrap>
          <v-col>
            {{ text }}
          </v-col>
        </v-row>
        <br />
        <v-row>
          <v-col>
            <div>
              Record Count: {{ counts.items }} <br />
            </div>
            <div>
              Media Count: {{ counts.media }} <br />
            </div>
          </v-col>
        </v-row>
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
const { backgroundImage, counts } = storeToRefs(useModuleStore())

const module = computed(() => {
  return current.value.module
})

const text = computed(() => {
  return `some text`
})

</script>

<style scoped>
#img {
  height: 100vh;
}

.opac {
  background-color: rgba(92, 19, 19, 0.2) !important;
  border-color: white !important;
}
</style>