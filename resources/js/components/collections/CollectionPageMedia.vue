<template>
  <v-row wrap>
     <v-col v-for="(item, index) in page" :key="index" cols="2">
      <MediaSquare
        v-bind="{
          source: source,
          itemIndex: itemIndex(index),
          item,          
          pageNoB1: pageNoB1,
          indexInPage: index,
          size: 250,
        }"
      ></MediaSquare>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup >
import { storeToRefs } from 'pinia'
import { useCollectionsStore } from '../../scripts/stores/collections';
import { computed } from 'vue'
import { TCollectionName, TPageItemMedia } from '../../types/collectionTypes'

import MediaSquare from '../media/MediaSquare.vue'

const props = defineProps<{
  source: TCollectionName
  pageNoB1: number
}>()

let { getPageArray } = useCollectionsStore()
let { itemsPerPage } = storeToRefs( useCollectionsStore())
const page = computed(() => {
  return getPageArray(props.source).value as TPageItemMedia[]
})


function itemIndex(index: number) : number{
  return (props.pageNoB1 - 1) * itemsPerPage.value.Media + index
}
</script>

