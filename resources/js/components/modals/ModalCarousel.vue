

<template>
  <v-container fluid>
    <v-card height="97vh">
      <v-toolbar height="36" class="bg-grey-lighten-1">
        <v-toolbar-title>{{ carouselHeader }}</v-toolbar-title>
        <v-spacer />
        <v-btn v-if="showNextArrows" size="small" @click="nextClicked(false)" icon="mdi-arrow-left"></v-btn>
        <v-btn v-if="showNextArrows" size="small" @click="nextClicked(true)" icon="mdi-arrow-right"> </v-btn>
        <v-btn size="small" @click="closeCarousel" icon="mdi-close"> </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-row>
          <v-card width="80%" height="92vh">
            <ImageZoom />
          </v-card>
          <v-card width="20%" class="bg-purple-lighten-5">
            <component :is="carouselForm" />
          </v-card>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup >
import { type Component, computed } from 'vue'
import { useCarouselStore } from '../../scripts/stores/modals/carousel'
import ImageZoom from './ImageZoom.vue'
import CarouselFormMain from './CarouselFormMain.vue'
import CarouselFormMedia from './CarouselFormMedia.vue'

const c = useCarouselStore()

const carouselForm = computed<Component>(() => {
  switch (c.collectionName) {
    case 'main':
      return CarouselFormMain
    case 'media':
    default:
      return CarouselFormMedia
  }
})

const carouselHeader = computed(() => {
  return c.carouselHeader
})


const showNextArrows = computed(() => {
  return c.arrayLength > 1
})

async function nextClicked(next: boolean) {
  c.next(next)
}

async function closeCarousel() {
  console.log(`closeCarousel`)
  await c.close()
}

</script>
