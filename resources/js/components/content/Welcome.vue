<template>
  <v-img id="img" v-if="backgroundImage" :src="backgroundImage.fullUrl" :lazy-src="backgroundImage.tnUrl" :cover="true">
    <v-card width="30%" height="100%" flat color="rgb(255, 0, 0, 0)" class="opac">
      <v-card-title class="title text-white text-h4">{{ name }} Welcome Page</v-card-title>
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



import { defineComponent, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '../../scripts/stores/main'
import { useModelStore } from '../../scripts/stores/model'
import { TMediaItem } from '../../types/mediaTypes'
defineComponent({
  name: "Welcome",
});

let main = useMainStore()
let model = useModelStore()

const { name, counts, backgroundImage } = storeToRefs(model)
const { isLoading } = storeToRefs(main)
const text = 'Main Text'

onMounted(() => {
  let elHtml = document.getElementsByTagName("html")[0];
  elHtml.style.overflowY = "hidden";
})

onUnmounted(() => {
  let elHtml = document.getElementsByTagName("html")[0];
  elHtml.style.overflowY = '';
})

// mounted: function () {
//   let elHtml = document.getElementsByTagName("html")[0];
//   elHtml.style.overflowY = "hidden";
// },
// unmounted: function () {
//   let elHtml = document.getElementsByTagName("html")[0];
//   elHtml.style.overflowY = null;
// },



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