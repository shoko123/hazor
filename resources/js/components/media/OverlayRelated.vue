<template>
    <v-btn class="ml-2 bg-grey-lighten-1" @click="goToItem()">Visit</v-btn>
    <v-btn v-if="props.hasMedia" class="ml-2 bg-grey-lighten-1" @click="openModalCarousel()">Lightbox</v-btn>
</template>

<script lang="ts" setup >
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { TCollectionName, TPageRelatedGallery } from '../../types/collectionTypes'
import { useCollectionRelatedStore } from '../../scripts/stores/collections/collectionRelated'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import { useCarouselStore } from '../../scripts/stores/modals/carousel'

const props = defineProps<{
  source: TCollectionName,
  itemIndex: number,
  hasMedia: boolean,
}>()

const { page, ipp } = storeToRefs(useCollectionRelatedStore())
let { moveFromItemToItem } = useRoutesMainStore()
const { open } = useCarouselStore()

const record = computed(() => {
  let indexInPage = props.itemIndex % ipp.value
  let record = page.value[indexInPage]
  return record
})

function openModalCarousel() {
  //console.log(`Open carousel clicked .....`)
  open(props.source, props.itemIndex)
}

function goToItem() {
  moveFromItemToItem(record.value.slug, record.value.id, record.value.module)
}
</script>