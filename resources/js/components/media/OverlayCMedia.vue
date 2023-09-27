<template>
  <div class="fill-height d-flex justify-center align-center">
    <v-btn class="bg-grey-lighten-1" @click="openModalCarousel()">Lightbox</v-btn>
  </div>
</template>
    

<script lang="ts" setup >
import { TCollectionName } from '../../types/collectionTypes'
import { onMounted } from 'vue'

import { useCarouselStore } from '../../scripts/stores/modals/carousel'

const props = defineProps<{
  source: TCollectionName,
  itemIndex: number,
}>()

onMounted(() => {
  //console.log(`Overlay.onMounted props: ${JSON.stringify(props, null, 2)}`)
})

const { open } = useCarouselStore()

function openModalCarousel() {
  console.log(`Open carousel clicked .....`)
  open(props.source, props.itemIndex)
}

</script>