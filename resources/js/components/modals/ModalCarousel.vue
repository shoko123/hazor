

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
import { storeToRefs } from 'pinia'
import { useCarouselStore } from '../../scripts/stores/modals/carousel'
import ImageZoom from './ImageZoom.vue'
import CarouselFormMain from './CarouselFormMain.vue'
import CarouselFormMedia from './CarouselFormMedia.vue'
import CarouselFormRelated from './CarouselFormRelated.vue'

const { close, next } = useCarouselStore()
const { showNextArrows, carouselHeader, collectionName } = storeToRefs(useCarouselStore())

const carouselForm = computed<Component>(() => {
  switch (collectionName.value) {
    case 'main':
      return CarouselFormMain
    case 'related':
      return CarouselFormRelated
    case 'media':
    default:
      return CarouselFormMedia
  }
})

async function nextClicked(isRight: boolean) {
  next(isRight)
}

async function closeCarousel() {
  console.log(`closeCarousel`)
  await close()
}

</script>
