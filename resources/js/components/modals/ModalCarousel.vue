

<template>
  <v-container fluid>
    <v-card height="97vh">
      <v-toolbar height="36" class="bg-grey-lighten-1">
        <v-toolbar-title>{{ carouselHeader }}</v-toolbar-title>
        <v-spacer />
        <v-btn size="small" @click="nextClicked(false)" icon="mdi-arrow-left"></v-btn>
        <v-btn size="small" @click="nextClicked(true)" icon="mdi-arrow-right"> </v-btn>
        <v-btn size="small" @click="closeCarousel" icon="mdi-close"> </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-row>
          <v-card width="80%" height="92vh">
            <ImageZoom/>
            <!-- <v-img :src="urls.full" :lazy-src="urls.tn" aspect-ratio="1" height="97vh" :cover="cover" class="bg-grey-lighten-2">
            </v-img> -->
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
import { useCarouselStore } from '../../scripts/stores/modals/carousel'
import ImageZoom from './ImageZoom.vue'

const c = useCarouselStore()
const itemDetails = computed(() => {
  return c.carouselItemDetails
})

const description = computed(() => {
  return itemDetails.value?.description === null ? '[no description]' : itemDetails.value?.description
})

const urls = computed(() => {
  return c.media.urls
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
