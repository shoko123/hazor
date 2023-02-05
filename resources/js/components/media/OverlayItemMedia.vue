<template>
  <div>
    <v-btn v-if="showLightBoxOption" @click="openModalCarousel()">Lightbox</v-btn>
  </div>
</template>  

<script lang="ts" setup >
import { TCollectionName, TPageItemMedia } from '../../types/collectionTypes'
import { computed } from 'vue'

const props = defineProps<{
  source: TCollectionName, 
  caller: string, 
  item: TPageItemMedia
}>()

const tagText = computed(() => {
  return props.item.item.tag
})
const showLightBoxOption = computed(() => {
  return true
})
function openModalCarousel() {
  console.log(`OverlayItemMedia.openModalCarousel clicked`)
}

</script>

