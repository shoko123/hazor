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
import { useCollectionMainStore } from '../../scripts/stores/collections/collectionMain'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import { useCarouselStore } from '../../scripts/stores/modals/carousel'

const props = defineProps<{
  source: TCollectionName,
  itemIndex: number,
}>()


const { ipp, page } = storeToRefs(useCollectionMainStore())
let { routerPush } = useRoutesMainStore()

onMounted(() => {
  //console.log(`Overlay.onMounted props: ${JSON.stringify(props, null, 2)}`)
})

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
  routerPush('show', record.value.slug)
}

</script>