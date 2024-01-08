<template>
  <v-card class="mx-auto" color="transparent" flat>
    <v-card-actions>
      <v-btn class="bg-grey-lighten-1" @click="goToItem()">Visit</v-btn>
      <v-btn v-if="props.hasMedia" class="bg-grey-lighten-1" @click="openModalCarousel()">Lightbox</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup >
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { TCollectionName } from '../../types/collectionTypes'
import { useCollectionsStore } from '../../scripts/stores/collections/collections'
import { useCollectionRelatedStore } from '../../scripts/stores/collections/collectionRelated'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import { useCarouselStore } from '../../scripts/stores/modals/carousel'

const props = defineProps<{
  source: TCollectionName,
  itemIndex: number,
  hasMedia: boolean
}>()

onMounted(() => {
  //console.log(`Overlay.onMounted record: ${JSON.stringify(record.value, null, 2)}`)
})

const { extra, page, ipp } = storeToRefs(useCollectionRelatedStore())
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