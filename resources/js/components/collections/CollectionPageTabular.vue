<template>
  <v-data-table-virtual v-if="collectionIsNotEmpty" :headers="(heads as any)" :items="page" class="elevation-1"
    height="80vh" item-value="slug" fixed-header><template v-slot:item.tag="{ item }">
      <v-btn @click="btnClicked(item)">{{ item.tag }}</v-btn>
    </template></v-data-table-virtual>
</template>

<script lang="ts" setup >
import type { VDataTableVirtual } from 'vuetify/lib/components/index.mjs'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { TCollectionName, TPageMainTabular, TPageRelatedTabular } from '@/js/types/collectionTypes'
import { useCollectionsStore } from '../../scripts/stores/collections/collections'
import { useCollectionRelatedStore } from '../../scripts/stores/collections/collectionRelated'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'

import { useModuleStore } from '../../scripts/stores/module'

const props = defineProps<{
  source: TCollectionName
  pageNoB1: number
}>()

let { collection } = useCollectionsStore()
let { getCurrentModuleStore } = useModuleStore()
let { routerPush, moveFromItemToItem } = useRoutesMainStore()
const { headers } = storeToRefs(useCollectionRelatedStore())

const heads = computed(() => {
  if (props.source === 'main') {
    const store = getCurrentModuleStore
    return store.headers
  } else {
    return headers.value
  }
})

const c = computed(() => {
  return collection(props.source).value
})

const page = computed(() => {
  switch (props.source) {
    case 'main':
      return c.value.page as TPageMainTabular[]
    case 'related':
      return c.value.page as TPageRelatedTabular[]
    case 'media':
      console.log(`**** Error media as source for tabular page ***`)
      return []
  }
})


const collectionIsNotEmpty = computed(() => {
  return page.value.length > 0
})

function btnClicked(item: any) {
  //console.log(`pageTable.btnClicked() item: ${JSON.stringify(item, null, 2)}`)
  if (props.source === 'main') {
    routerPush('show', item.slug)
  } else {
    moveFromItemToItem(item.slug, item.id, item.module)
  }
}
</script>
