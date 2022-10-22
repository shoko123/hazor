<template>
  <div>
    <v-btn v-if="showLightBoxOption" @click="openLightBox()">Lightbox</v-btn>
  </div>
</template>  

<script lang="ts" setup >
import { TSource, IMediaItem } from '../../types/collectionTypes'
import { computed } from 'vue'

const props = defineProps<{
  source: TSource, 
  caller: string, 
  item: IMediaItem
}>()

const tagText = computed(() => {
  return props.item.tag
})
const showLightBoxOption = computed(() => {
  return true
})
function openLightBox() {
  console.log(`Open lightbox clicked`)
}

</script>

