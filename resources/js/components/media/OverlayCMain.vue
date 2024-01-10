<template>
  <v-btn class="ml-2 bg-grey-lighten-1" @click="goToItem()">Visit</v-btn>
  <v-btn v-if="props.record.media.hasMedia" class="ml-2 bg-grey-lighten-1" @click="openModalCarousel()">Lightbox</v-btn>
</template>
    

<script lang="ts" setup >
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { TPageMainGallery } from '../../types/collectionTypes'
import { useCollectionMainStore } from '../../scripts/stores/collections/collectionMain'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import { useCarouselStore } from '../../scripts/stores/modals/carousel'

const props = defineProps<{
  itemIndex: number,
  record: any
}>()

const { ipp, page } = storeToRefs(useCollectionMainStore())
let { routerPush } = useRoutesMainStore()
const { open } = useCarouselStore()


function openModalCarousel() {
  //console.log(`Open carousel clicked .....`)
  open('main' , props.itemIndex)
}

function goToItem() {
  routerPush('show', props.record.slug)
}

</script>