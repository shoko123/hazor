

<template>
  <v-container fluid class="fill-height">
    <v-card class="h-100">

      <v-toolbar id="toolbar" height="36">
        <v-toolbar-title>{{ header }}</v-toolbar-title>
        <v-spacer />
        <v-btn size="small" @click="arrowClicked(false)" icon="mdi-arrow-left"></v-btn>
        <v-btn size="small" @click="arrowClicked(false)" icon="mdi-arrow-right"> </v-btn>
        <v-btn size="small" @click="closeLightBox" icon="mdi-close"> </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-row>
          <v-card width="80%">
            <v-img :src="media.urls.full" :lazy-src="media.urls.tn" aspect-ratio="1" max-height="61%" max-width="100%"
              contain class="bg-grey">
            </v-img>
          </v-card>

          <v-card width="20%" class="bg-purple-lighten-5">
            <v-card-title class="ma-2 text--body-1 bold"> {{ header }}</v-card-title>
            <v-card-text>
              <v-row class="text-body-1">
                {{ text }}</v-row>
            </v-card-text>
          </v-card>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup >

import { computed } from 'vue'
import { useModalStore } from '../../scripts/stores/modals/modal'
import { useCarouselStore } from '../../scripts/stores/modals/carousel'
import LightboxImage from './LightboxImage.vue'
import { storeToRefs } from 'pinia'
import { isBooleanAttr } from '@vue/shared'
const m = useModalStore()
const lb = useCarouselStore()

const info = computed(() => {
  return lb.carouselInfo
})

const isReady = computed(() => {

  return true
})

const categoryIndex = computed({
  get: () => { return true },
  set: val => {
    console.log(`categoryIndex set to ${val}`)
  }
})

function arrowClicked(next: boolean) {
  return next
}

const lightBox = computed(() => {

})

const showArrows = computed(() => {
  return true
})
const media = computed(() => {
  return {
    hasMedia: true,
    urls: {
      full: 'https://picsum.photos/510/300?random',
      tn: 'https://picsum.photos/510/300?random'
    }
  }
})
const text = computed(() => {
  return "Text"
})
const header = computed(() => {
  return "Header"
})

function closeLightBox() {
  console.log(`closeLightbox`)
}

</script>
<style scoped>
#toolbar {
  background-color: grey;
}
</style>
