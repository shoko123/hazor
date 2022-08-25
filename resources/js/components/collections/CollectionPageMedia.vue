<template>
  <v-row wrap>
     <v-col v-for="(item, index) in page" :key="item.id" cols="2">
      <MediaSquare :source=props.source caller="collectionItem" :item=item size="250"
      ></MediaSquare> 
    </v-col>
  </v-row>
</template>

<script lang="ts" setup >
import { useCollectionsStore } from '../../scripts/stores/collections';
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { TCollection, TSource, TElement, TItemsPerPage, TView, IArrayItem, IPageMediaItem, IPageTableItem, IPageMediaItemDisplay } from '../../types/collectionTypes'

import MediaSquare from '../media/MediaSquare.vue'
import CollectionPageChips from './CollectionPageChips.vue'
import CollectionPageTable from './CollectionPageTable.vue'
import { useStatusStore } from '../../scripts/stores/status';


const props = defineProps<{
  source: TSource
}>()

let { getCollectionDisplayData } = useCollectionsStore()

const page = computed(() => {
  let c = getCollectionDisplayData(props.source)
  //console.log(`CPMedia.page() CollectionDisplayData: ${JSON.stringify(c, null, 2)} source: ${props.source}` )
  return c.page as IPageMediaItemDisplay[]
})

function goTo(item: any) {
  console.log("goTo")
}
</script>

