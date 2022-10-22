<template>
  <v-card class="elevation-12">
    <template v-slot:title density="compact">
      <v-toolbar id="collection" density="compact">
        <v-toolbar-title>{{ header }}</v-toolbar-title>
        <v-pagination v-model="page" :length="paginator.pages" :total-visible="10">
        </v-pagination>
        <v-spacer></v-spacer>
        <v-btn size="small" variant="outlined" @click="toggleDisplayOption()">view: {{ displayOption }} </v-btn>
      </v-toolbar>
    </template>

    <v-card-text>
      <v-container fluid class="ma-0 pa-0">
        <component :is="collectionPage" :source=props.source :pageNoB1="meta.pageNoB1" />
      </v-container>
    </v-card-text>
  </v-card>
</template>


<script lang="ts" setup >

import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { TSource } from '../../types/collectionTypes'

import CollectionPageMedia from './CollectionPageMedia.vue'
import CollectionPageChips from './CollectionPageChips.vue'
import CollectionPageTable from './CollectionPageTable.vue'
import { useRoutesStore } from '../../scripts/stores/routes/routesMain';
import { useCollectionsStore } from '../../scripts/stores/collections'

const props = defineProps<{
  source: TSource
}>()

let { to } = storeToRefs(useRoutesStore())
let { collectionMeta, setCollectionElement } = useCollectionsStore()








const meta = computed(() => {
  return collectionMeta(props.source)
})

const page = computed({
  get: () => { return paginator.value.page },
  set: val => {
    console.log(`Collection.page.set to ${val}`)
    setCollectionElement(props.source, 'page', val)
  }
})


const header = computed(() => {
  //let dd = collections.CollectionMeta(props.source)
  //let dd = collections.pageMain
  return `${to.value.module} results: page(${meta.value.pageNoB1}/${meta.value.noOfPages}), items(${meta.value.firstItemNo} - ${meta.value.lastItemNo}/${meta.value.noOfItems})`
})

const paginator = computed(() => {
  //let dd = collections.CollectionMeta(props.source)
  //let dd = collections.pageMain
  //console.log(`paginator() display: ${JSON.stringify(dd, null, 2)}`);

  return {
    show: meta.value.noOfPages > 1
    , page: meta.value.pageNoB1, pages: meta.value.noOfPages
  }
  //return `${to.value.module} results. Showing page(${meta.value.pageNoB1}/${meta.value.noOfPages}), items(${meta.value.firstItemNo}- ${meta.value.lastItemNo}/${meta.value.noOfItems})`
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
      alert("Wrong view")
  }
})



const displayOption = computed(() => {
  return meta.value.views[meta.value.viewIndex]
})

const itemsPerPage = computed(() => {
  return `CollectionPageMedia`
})

const pages = computed(() => {
  return `CollectionPageMedia`
})
const disable = computed(() => {
  return false
})







function toggleDisplayOption() {
  //let c = collections.viewsData(props.source)
  //console.log(`toggle display option() collection: ${JSON.stringify(c, null, 2)}\ncurrent: ${c.viewIndex}, next: ${(c.viewIndex + 1)%(c.views.length)}`);
  //c.viewIndex = (c.viewIndex + 1)%(c.views.length)
  setCollectionElement(props.source, 'viewIndex', (meta.value.viewIndex + 1) % (meta.value.views.length))
}

</script>
<style scoped>
#collection {
  background-color: grey;
}
</style>

