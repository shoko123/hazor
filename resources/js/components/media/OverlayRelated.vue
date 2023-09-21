<template>
  <v-card class="mx-auto" color="transparent" flat>
    <v-card-actions>
      <v-btn class="bg-grey-lighten-1" @click="goToItem()">Visit</v-btn>
      <v-btn class="bg-grey-lighten-1" @click="openModalCarousel()">Lightbox</v-btn>
    </v-card-actions>
  </v-card>
</template>
    

<script lang="ts" setup >
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { TCollectionName, TPageCMainVImage } from '../../types/collectionTypes'
import { useCollectionsStore } from '../../scripts/stores/collections/collections'
import { useCollectionRelatedStore } from '../../scripts/stores/collections/collectionRelated'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import { useCarouselStore } from '../../scripts/stores/modals/carousel'


const props = defineProps<{
  source: TCollectionName,
  itemIndex: number,
}>()

onMounted(() => {
  //console.log(`Overlay.onMounted props: ${JSON.stringify(props, null, 2)}`)
})

let { getIpp } = useCollectionsStore()
const related = storeToRefs(useCollectionRelatedStore())
let { routerPush } = useRoutesMainStore()
const { open } = useCarouselStore()

const record = computed(() => {
  let ipp = getIpp(related.extra.value.views[related.extra.value.viewIndex])
  let indexInPage = props.itemIndex % ipp
  let record = related.page.value[indexInPage]
  return record
})

function openModalCarousel() {
  //console.log(`Open carousel clicked .....`)
  open(props.source, props.itemIndex)
}

function goToItem() {
  routerPush('show', record.value.slug, record.value.module)
}
</script>