<template>
  <v-data-table-virtual :headers="(heads as any)" :items="page" class="elevation-1" height="80vh" item-value="slug"
    fixed-header><template v-slot:item.tag="{ item }">
      <v-btn @click="btnClicked(item)">{{ item.columns.tag }}</v-btn>
    </template></v-data-table-virtual>
</template>

<script lang="ts" setup >
import { VDataTableVirtual } from 'vuetify/labs/VDataTable'
import { computed } from 'vue'
import { TCollectionName } from '@/js/types/collectionTypes'
import { useCollectionsStore } from '../../scripts/stores/collections/collections'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import { useModuleStore } from '../../scripts/stores/module'

const props = defineProps<{
  source: TCollectionName
  pageNoB1: number
}>()

let { collection } = useCollectionsStore()
let { getCurrentStore } = useModuleStore()
let { routerPush } = useRoutesMainStore()

const heads = computed(() => {
  const store = getCurrentStore
  return store.headers
})

const c = computed(() => {
  return collection(props.source).value
})

const page = computed(() => {
  return c.value.page //as TPageCMainVTable[]
})

function btnClicked(item: any) {
  routerPush('show', item.raw.slug)
}
</script>
