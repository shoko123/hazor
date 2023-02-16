<template>
  <v-card class="elevation-12">
    <v-toolbar id="collection" density="compact" :height="50">
      <v-toolbar-title>{{ header }}</v-toolbar-title>
      <v-pagination v-model="page" :length="paginator.pages" :total-visible="16">
      </v-pagination>
      <!-- <v-spacer></v-spacer> -->
      <v-btn size="small" variant="outlined" @click="toggleDisplayOption()">view: {{ displayOption }} </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-container fluid class="ma-0 pa-0">
        <component :is="collectionPage" :source=props.source :pageNoB1="meta.pageNoB1" />
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup >

import { computed } from 'vue'
import { TSetPage, TCollectionName, TView } from '../../types/collectionTypes'
import CollectionPageMedia from './CollectionPageMedia.vue'
import CollectionPageChips from './CollectionPageChips.vue'
import CollectionPageTable from './CollectionPageTable.vue'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain';
import { useCollectionsStore } from '../../scripts/stores/collections'

const props = defineProps<{
  source: TCollectionName
}>()

let { getModule } = useRoutesMainStore()
let { collectionMeta, loadPage, toggleCollectionView } = useCollectionsStore()

const meta = computed(() => {
  return collectionMeta(props.source)
})

const page = computed({
  get: () => { return paginator.value.page },
  set: val => {
    console.log(`Collection.page.set to ${val}`)
    loadPage(props.source, val, meta.value.viewIndex, getModule())
  }
})

const pageInfo = computed(() => {
  return `page(${meta.value.pageNoB1}/${meta.value.noOfPages}), items(${meta.value.firstItemNo} - ${meta.value.lastItemNo}/${meta.value.noOfItems})`
})


const header = computed(() => {
  const module = getModule()
  switch (props.source) {
    case 'main':
      return `${module} results: ${pageInfo.value}`
    case 'media':
      return `${module} item's media: ${pageInfo.value}`
    case 'related':
      return ``
  }
})

const paginator = computed(() => {
  return {
    show: meta.value.noOfPages > 1,
    page: meta.value.pageNoB1,
    pages: meta.value.noOfPages
  }
})
const showPaginator = computed(() => {
  return true
})

const collectionPage = computed(() => {

  switch (meta.value.views[meta.value.viewIndex]) {
    case 'Media':
      return CollectionPageMedia
    case 'Chips':
      return CollectionPageChips
    case 'Table':
      return CollectionPageTable
    default:
      alert(`Wrong view! viewIndex: ${meta.value.viewIndex}`)
  }
})

const displayOption = computed(() => {
  return meta.value.views[meta.value.viewIndex]
})


const disable = computed(() => {
  return false
})

function toggleDisplayOption() {
  toggleCollectionView(props.source)
}

</script>
<style scoped>
#collection {
  background-color: grey;
}
</style>

