<template>
  <v-row justify="center" align="center">
    <v-btn class="bg-grey-lighten-1" @click="openModalCarousel()"> Lightbox </v-btn>
  </v-row>
</template>

<script lang="ts" setup>
import type { TPageMediaGallery } from '../../types/collectionTypes'
import { useCarouselStore } from '../../scripts/stores/modals/carousel'

const props = defineProps<{
  itemIndex: number
  record: TPageMediaGallery
}>()

const { open } = useCarouselStore()

function openModalCarousel() {
  console.log(`Open carousel clicked .....`)
  open('media', props.itemIndex)
}
</script>
