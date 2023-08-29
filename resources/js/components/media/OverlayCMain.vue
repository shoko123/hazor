<template>
  <v-card class="mx-auto" color="transparent" flat>
    <!-- <v-card-text class="text-body-1 white--text"> {{text}}
    </v-card-text> -->
    <v-card-actions>
      <v-btn class="but" @click="goToItem()">Visit</v-btn>
      <v-btn class="but" @click="openModalCarousel()">Lightbox</v-btn>
    </v-card-actions>
  </v-card>
  <!--h5 v-if="hasMedia">{{ text }}</h5-->
</template>
    

<script lang="ts" setup >
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { TCollectionName, TPageCMainVImage } from '../../types/collectionTypes'
import { useCollectionsStore } from '../../scripts/stores/collections/collections'
import { useCollectionMainStore } from '../../scripts/stores/collections/collectionMain'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import { useCarouselStore } from '../../scripts/stores/modals/carousel'

import type { LocationQueryRaw } from 'vue-router'
let { getIpp } = useCollectionsStore()

const main = storeToRefs(useCollectionMainStore())
const router = useRouter()
const props = defineProps<{
  source: TCollectionName,
  itemIndex: number,
}>()

let { current } = storeToRefs(useRoutesMainStore())
onMounted(() => {
  //console.log(`Overlay.onMounted props: ${JSON.stringify(props, null, 2)}`)
})

const { open } = useCarouselStore()

const record = computed(() => {
  
  let ipp = getIpp(main.extra.value.views[main.extra.value.viewIndex])
  let indexInPage = props.itemIndex % ipp
  let record = main.page.value[indexInPage]
  return record
})

function openModalCarousel() {
  //console.log(`Open carousel clicked .....`)
  open(props.source, props.itemIndex )
}

function goToItem() {
  //console.log(`goto item: ${JSON.stringify(item, null, 2)}`)
  let queryParams = current.value.queryParams
  router.push({ name: 'show', params: { module: current.value.url_module, slug: record.value.slug }, query: <LocationQueryRaw>queryParams})
}


</script>

<style scoped>
.but {
  background-color: rgb(118, 127, 123);
}
</style>