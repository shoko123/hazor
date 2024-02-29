<template>
  <v-btn class="ml-2 bg-grey-lighten-1" @click="goToItem()"> Visit </v-btn>
  <v-btn
    v-if="props.record.media.hasMedia"
    class="ml-2 bg-grey-lighten-1"
    @click="openModalCarousel()"
  >
    Lightbox
  </v-btn>
</template>

<script lang="ts" setup>
import { TPageRelatedGallery } from '../../types/collectionTypes'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import { useCarouselStore } from '../../scripts/stores/modals/carousel'

const props = defineProps<{
  itemIndex: number
  record: TPageRelatedGallery
}>()

let { moveFromItemToItem } = useRoutesMainStore()
const { open } = useCarouselStore()

function openModalCarousel() {
  open('related', props.itemIndex)
}

function goToItem() {
  moveFromItemToItem(props.record.slug, props.record.id, props.record.module)
}
</script>
