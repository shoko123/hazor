

<template>
  <v-container fluid>
    <v-card height="97vh">
      <v-toolbar
        height="36"
        class="bg-grey-lighten-1"
      >
        <v-toolbar-title>{{ carouselHeader }}</v-toolbar-title>
        <v-btn
          v-if="showNextArrows"
          size="small"
          icon="mdi-arrow-left"
          @click="nextClicked(false)"
        />
        <v-btn
          v-if="showNextArrows"
          size="small"
          icon="mdi-arrow-right"
          @click="nextClicked(true)"
        />
        <v-btn
          size="small"
          icon="mdi-close"
          @click="closeCarousel"
        />
      </v-toolbar>

      <v-card-text>
        <v-row wrap>
          <v-col :cols="widths[0]">
            <v-card>
              <ImageZoom />
            </v-card>
          </v-col>
          <v-col :cols="widths[1]">
            <v-card class="bg-purple-lighten-5">
              <component :is="carouselForm" />
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>

import { storeToRefs } from 'pinia'
import { useDisplay } from 'vuetify'
import { type Component, computed } from 'vue'
import type { TCarouselMain, TCarouselRelated, TCarouselMedia } from '@/js/types/mediaTypes'

import { useCarouselStore } from '../../scripts/stores/modals/carousel'
import ImageZoom from './ImageZoom.vue'
import CarouselFormMain from './CarouselFormMain.vue'
import CarouselFormMedia from './CarouselFormMedia.vue'
import CarouselFormRelated from './CarouselFormRelated.vue'

const { smAndDown } = useDisplay()
const { close, next } = useCarouselStore()
const { index, arrayLength, collectionName, carouselItemDetails } = storeToRefs(useCarouselStore())

const carouselForm = computed<Component>(() => {
  switch (collectionName.value) {
    case 'main':
      return CarouselFormMain
    case 'related':
      return CarouselFormRelated
    case 'media':
      return CarouselFormMedia
  }
})

const carouselHeader = computed(() => {
  let text = ""
  switch (collectionName.value) {
    case 'main':
      const dMain = <TCarouselMain>carouselItemDetails.value
      text = `${dMain.module} ${dMain.tag}`
      break
    case 'related':
      const dRelated = <TCarouselRelated>carouselItemDetails.value
      text = `${dRelated.tag} Related:`
      text += smAndDown.value ? `` : ` (${dRelated.module} ${dRelated.tag}. Relation: ${dRelated.relation_name})`
      break
    case 'media':
      const dMedia = <TCarouselMedia>carouselItemDetails.value
      text = `${dMedia.tag}: Media`
      break
  }
  return `${text}(${index.value + 1}/${arrayLength.value})`
})

const widths = computed(() => {
  return smAndDown.value ? [12, 12] : [9, 3]
})

const showNextArrows = computed(() => {
  return arrayLength.value > 1
})

async function nextClicked(isRight: boolean) {
  next(isRight)
}

async function closeCarousel() {
  console.log(`closeCarousel`)
  await close()
}

</script>
