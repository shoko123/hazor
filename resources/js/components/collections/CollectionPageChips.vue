<template>
  <v-row wrap>
    <v-chip v-for="(item, index) in page" :key="index" class="font-weight-normal ma-2 body-1" @click="goTo(item)">{{
      item.tag
    }}</v-chip>
  </v-row>
</template>

<script lang="ts" setup >

import { computed } from 'vue'
import { TCollectionName, TPageVChip } from '../../types/collectionTypes'
import { useCollectionsStore } from '../../scripts/stores/collections/collections'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'

const props = defineProps<{
  source: TCollectionName
  pageNoB1: number
}>()

const { collection } = useCollectionsStore()
const { routerPush, moveFromItemToItem } = useRoutesMainStore()

const c = computed(() => {
  return collection(props.source).value
})

const page = computed(() => {
  return c.value.page as TPageVChip[]
})

function goTo(item: any) {
  switch (props.source) {
    case 'main':
      routerPush('show', item.slug)
      break

    case 'related':
      moveFromItemToItem(item.slug, item.id, item.module)
      break
  }
}
</script>

