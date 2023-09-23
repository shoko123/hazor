<template>
  <v-card class="elevation-12">
    <v-toolbar class="bg-grey text-black" density="compact" :height="50">
      <v-toolbar-title>{{ header }}</v-toolbar-title>
      <v-pagination v-if="paginator.show" v-model="page" :length="paginator.pages" :total-visible="16">
      </v-pagination>

      <v-btn v-if="showBtnViewToggle" size="small" variant="outlined" @click="toggleCollectionDisplayOption()">view: {{
        displayOption }}
      </v-btn>

    </v-toolbar>
    <v-card-text>
      <v-container fluid class="ma-0 pa-0">
        <component :is="collectionPage" :source=props.source :pageNoB1="meta.pageNoB1" />
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup >
import { type Component, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { TCollectionName } from '@/js/types/collectionTypes'
import CollectionPageImage from './CollectionPageImage.vue'
import CollectionPageChips from './CollectionPageChips.vue'
import CollectionPageTable from './CollectionPageTable.vue'
import { useItemStore } from '../../scripts/stores/item';
import { useCollectionsStore } from '../../scripts/stores/collections/collections'

const props = defineProps<{
  source: TCollectionName
}>()

let { collection, loadPage, toggleCollectionView } = useCollectionsStore()
let { tag, derived } = storeToRefs(useItemStore())
const c = computed(() => {
  return collection(props.source).value
})

const meta = computed(() => {
  return c.value.meta
})

const page = computed({
  get: () => { return paginator.value.page },
  set: val => {
    //console.log(`Collection.page.set to ${val}`)
    loadPage(props.source, val, meta.value.view, derived.value.module)
  }
})

const pageInfoAsText = computed(() => {
  if (meta.value.length === 0) {
    return `[Empty]`
  }
  if (meta.value.length === 1) {
    return `item(1)`
  }
  if (meta.value.noOfPages === 1) {
    return `items(${meta.value.firstItemNo} - ${meta.value.lastItemNo}/${meta.value.noOfItems})`
  }
  return `page(${meta.value.pageNoB1}/${meta.value.noOfPages}), items(${meta.value.firstItemNo} - ${meta.value.lastItemNo}/${meta.value.noOfItems})`
})


const header = computed(() => {
  switch (props.source) {
    case 'main':
      return `${derived.value.module} query results: ${pageInfoAsText.value}`
    case 'media':
      return `${derived.value.module} "${tag.value}" - media: ${pageInfoAsText.value}`
    case 'related':
      return `${derived.value.module} "${tag.value}" - related items: ${pageInfoAsText.value}`
  }
})

const paginator = computed(() => {
  return {
    show: meta.value.noOfPages > 1,
    page: meta.value.pageNoB1,
    pages: meta.value.noOfPages
  }
})

const collectionPage = computed<Component>(() => {
  switch (meta.value.view.name) {
    case 'Image':
      return CollectionPageImage
    case 'Chip':
      return CollectionPageChips
    case 'Table':
      return CollectionPageTable
    default:
      console.log(`Collection.vue invalid collectionPage: ${meta.value.viewIndex}`)
      return CollectionPageImage
  }
})

const showBtnViewToggle = computed(() => {
  return meta.value.length > 0 && meta.value.views.length > 1
})
const displayOption = computed(() => {
  return meta.value.view.name
})

function toggleCollectionDisplayOption() {
  toggleCollectionView(props.source)
}

</script>


