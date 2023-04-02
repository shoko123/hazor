<template>
  <div>
    <v-btn v-if="showLightBoxOption" @click="openModalCarousel()">Lightbox</v-btn>
  </div>
</template>  

<script lang="ts" setup >
import { TCollectionName } from '../../types/collectionTypes'
import {TMedia, TMediaProps, } from '../../types/mediaTypes'
import { computed } from 'vue'

const props = defineProps<{
  source: TCollectionName, 
  caller: string, 
  item: TMediaProps
}>()


const showLightBoxOption = computed(() => {
  return true
})
function openModalCarousel() {
  console.log(`OverlayItemMedia.openModalCarousel clicked`)
}

</script>

