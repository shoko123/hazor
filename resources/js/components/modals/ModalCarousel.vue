

<template>
  <v-container fluid>
    <v-card height="97vh">
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
            <v-img :src="urls.full" :lazy-src="urls.tn" aspect-ratio="1" height="97vh" :cover="cover" class="bg-grey-lighten-2">
            </v-img>
          </v-card>

          <v-card width="20%" class="bg-purple-lighten-5">
            <v-card-title class="ma-2 text--body-1 bold"> {{ description }}</v-card-title>
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
import { TCarousel } from '@/js/types/mediaTypes'
import { useModalStore } from '../../scripts/stores/modals/modal'
import { useCarouselStore } from '../../scripts/stores/modals/carousel'
import { storeToRefs } from 'pinia'
import { isBooleanAttr } from '@vue/shared'

const m = useModalStore()
const c = useCarouselStore()

const isReady = computed(() => {

  return true
})

const cover = computed(() => {
  return !c.media.hasMedia
})
const categoryIndex = computed({
  get: () => { return true },
  set: val => {
    console.log(`categoryIndex set to ${val}`)
  }
})

const itemDetails = computed(() => {
  return c.carouselItemDetails
})



const description = computed(() => {
  return itemDetails.value?.description === null ? '[no description]' : itemDetails.value?.description
})

const urls = computed(() => {
  return c.media.urls
})

const text = computed(() => {
  return "Text"
})
const carouselHeader = computed(() => {
  return c.carouselHeader
})

async function nextClicked(next: boolean) {
  c.next(next)
}

async function closeCarousel() {
  console.log(`closeCarousel`)
  await c.close()
}

</script>
<style scoped>
#toolbar {
  background-color: grey;
}
</style>
