<template>
  <v-row wrap>
     <v-col v-for="(item, index) in page" :key="item.id" cols="2">
      <MediaSquare
        v-bind="{
          source: source,
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
import { useCollectionsStore } from '../../scripts/stores/collections';
import { computed } from 'vue'
import { TSource, IMediaItem } from '../../types/collectionTypes'

import MediaSquare from '../media/MediaSquare.vue'

const props = defineProps<{
  source: TSource
  pageNoB1: number
}>()

let { getPageArray } = useCollectionsStore()

const page = computed(() => {
  return getPageArray(props.source).value as IMediaItem[]
})


function goTo(item: any) {
  console.log("goTo")
}
</script>

