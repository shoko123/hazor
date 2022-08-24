<template>
<div>Page(Media)</div>
  <v-row wrap>
    <v-chip
      v-for="(item, index) in c.main.value.page"
      :key="index"
      
      class="font-weight-normal ma-2 body-1"
      @click="goTo(item)"
      >{{ item?.url_id}}</v-chip
    >
  </v-row>
</template>

<script lang="ts" setup >
import { useCollectionsStore } from '../../scripts/stores/collections';
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { TCollection, TSource, TElement, TItemsPerPage, TView, IArrayItem, IPageMediaItem, IPageTableItem } from '../../../types/collectionTypes'

import CollectionPageMedia from './CollectionPageMedia.vue'
import CollectionPageChips from './CollectionPageChips.vue'
import CollectionPageTable from './CollectionPageTable.vue'
import { useStatusStore } from '../../scripts/stores/status';


const props = defineProps<{
  source: TSource
}>()

let status = storeToRefs(useStatusStore())
let c = storeToRefs(useCollectionsStore())
function goTo(item: any) {
  console.log("goTo")
}
</script>

