<template>
  <v-row wrap>
     <v-col v-for="(item, index) in page" :key="index" cols="2">
      <MediaSquare
        v-bind="{
          source: source,
          itemIndex: itemIndex(index),
          media: item.media,
          details: {id: item.id, url_id: item.url_id, tag: item.tag, description: item.description},          
          size: 250,
        }"
      ></MediaSquare>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup >
import { storeToRefs } from 'pinia'
import { useCollectionsStore } from '../../scripts/stores/collections/collections';
import { computed } from 'vue'
import { TCollectionView, TCollectionName, TPageCMainVImage } from '../../types/collectionTypes'

import MediaSquare from '../media/MediaSquare.vue'

const props = defineProps<{
  source: TCollectionName
  pageNoB1: number
}>()

let { collection } = useCollectionsStore()

const c = computed(() => {
  return collection(props.source).value
})


const page = computed(() => {
  return c.value.page as TPageCMainVImage[]
})


function itemIndex(index: number) : number{
  return (props.pageNoB1 - 1) * c.value.meta.itemsPerPage + index
}
</script>

