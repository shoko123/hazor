

<template>
  <v-container fluid>
    <v-card height="97vh">
      <v-toolbar height="36" class="bg-grey-lighten-1">
        <v-toolbar-title>{{ carouselHeader }}</v-toolbar-title>
        <!-- <v-spacer /> -->
        <v-btn v-if="showNextArrows" size="small" @click="nextClicked(false)" icon="mdi-arrow-left"></v-btn>
        <v-btn v-if="showNextArrows" size="small" @click="nextClicked(true)" icon="mdi-arrow-right"> </v-btn>
        <v-btn size="small" @click="closeCarousel" icon="mdi-close"> </v-btn>
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

<script lang="ts" setup >

import { storeToRefs } from 'pinia'
import { useDisplay } from 'vuetify'
import { type Component, computed } from 'vue'

import { TCollectionName } from '@/js/types/collectionTypes'
import { TCarouselMain, TCarouselRelated } from '@/js/types/mediaTypes'

import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import { useItemStore } from '../../scripts/stores/item'
import { useCarouselStore } from '../../scripts/stores/modals/carousel'
import { useCollectionsStore } from '../../scripts/stores/collections/collections'

import ImageZoom from './ImageZoom.vue'
import CarouselFormMain from './CarouselFormMain.vue'
import CarouselFormMedia from './CarouselFormMedia.vue'
import CarouselFormRelated from './CarouselFormRelated.vue'

const { smAndDown } = useDisplay()
const { close, next } = useCarouselStore()
const { index } = storeToRefs(useCarouselStore())
const { showNextArrows, collectionName, carouselItemDetails } = storeToRefs(useCarouselStore())
const { current } = useRoutesMainStore()
const { derived } = storeToRefs(useItemStore())

let c = useCollectionsStore()
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
  let collection = c.collection(<TCollectionName>collectionName.value)
  let text = ""
  switch (collectionName.value) {
    case 'main':
      text = `${current.module} Results. ${(<TCarouselMain>carouselItemDetails.value)?.module} ${(<TCarouselMain>carouselItemDetails.value)?.tag}`
      break
    case 'related':
      text = `${derived.value.moduleAndTag} Related:`
      text += smAndDown.value ? `` : ` (${(<TCarouselRelated>carouselItemDetails.value)?.module} ${(<TCarouselRelated>carouselItemDetails.value)?.tag}. Relation: ${(<TCarouselRelated>carouselItemDetails.value)?.relation_name})`
      break
    case 'media':
      text = `${derived.value.moduleAndTag}: Media`
      break
  }
  return `${text} (${index.value + 1}/${collection.value.array.length})`
})

const widths = computed(() => {
  return smAndDown.value ? [12, 12] : [9, 3]
})

async function nextClicked(isRight: boolean) {
  next(isRight)
}

async function closeCarousel() {
  console.log(`closeCarousel`)
  await close()
}

</script>
