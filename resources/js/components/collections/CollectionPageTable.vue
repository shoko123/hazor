<template>
  <v-data-table-virtual
    :headers="(heads as any)"
    :items="page"
    class="elevation-1"
    height="80vh"
    item-value="slug"
    fixed-header
  ></v-data-table-virtual>

</template>

<script lang="ts" setup >
import { VDataTableVirtual } from 'vuetify/labs/VDataTable'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { TCollectionName, TPageCMainVTable, TApiPageTableLocus } from '@/js/types/collectionTypes'
import { useCollectionsStore } from '../../scripts/stores/collections/collections'
import { useLocusStore } from '../../scripts/stores/modules/locus'
import { useModuleStore } from '../../scripts/stores/module'
const props = defineProps<{
  source: TCollectionName
  pageNoB1: number
}>()

let { collection } = useCollectionsStore()
let { getCurrentStore } = useModuleStore()

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


</script>

<style scoped>
#table {
  height: 80vh;
}
</style>
