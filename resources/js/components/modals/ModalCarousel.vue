

<template>
  <v-container fluid class="fill-height">
    <v-card class="h-100">

      <v-toolbar id="toolbar" height="36">
        <v-toolbar-title>{{ carouselHeader }}</v-toolbar-title>
        <v-spacer />
        <v-btn size="small" @click="nextClicked(false)" icon="mdi-arrow-left"></v-btn>
        <v-btn size="small" @click="nextClicked(true)" icon="mdi-arrow-right"> </v-btn>
        <v-btn size="small" @click="closeCarousel" icon="mdi-close"> </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-row>
          <v-card width="80%">
            <v-img :src="urls.full" :lazy-src="urls.tn" aspect-ratio="1" max-height="61%" max-width="100%"
              contain class="bg-grey">
            </v-img>
          </v-card>

          <v-card width="20%" class="bg-purple-lighten-5">
            <v-card-title class="ma-2 text--body-1 bold"> {{ itemTag }}</v-card-title>
            <v-card-text>
              <v-row class="text-body-1">
                {{ description }}</v-row>
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
import { storeToRefs } from 'pinia'
import { isBooleanAttr } from '@vue/shared'
const m = useModalStore()
const c = useCarouselStore()

const info = computed(() => {
  return c.carouselInfo
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

async function nextClicked(next: boolean) {

}

const itemTag = computed(() => {
  return c.carouselInfo.item.tag
})

const description = computed(() => {
  return c.carouselInfo.item.description
})

const urls = computed(() => {
  return c.carouselInfo.media.urls
})

const text = computed(() => {
  return "Text"
})
const carouselHeader = computed(() => {
  return info.value.carouselHeader
})

function closeCarousel() {
  console.log(`closeCarousel`)
  c.close()
}

</script>
<style scoped>
#toolbar {
  background-color: grey;
}
</style>
