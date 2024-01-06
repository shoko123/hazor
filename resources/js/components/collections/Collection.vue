<template>
  <v-card class="elevation-12">
    <v-toolbar class="bg-grey text-black" density="compact" :height="50">

      <v-toolbar-title>{{ header }}</v-toolbar-title>

      <v-pagination v-if="paginator.show" v-model="page" :length="paginator.pages"
        :total-visible="`${mdAndDown ? 4 : 10}`">
      </v-pagination>

      <v-btn v-if="showBtnViewToggle" :icon="ico" size="small" variant="tonal" @click="toggleCollectionDisplayOption()">
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
import { storeToRefs } from 'pinia'
import { useDisplay } from 'vuetify'

import type { TCollectionName } from '@/js/types/collectionTypes'
import { useItemStore } from '../../scripts/stores/item';
import { useCollectionsStore } from '../../scripts/stores/collections/collections'

import CollectionPageGallery from './CollectionPageGallery.vue'
import CollectionPageChips from './CollectionPageChips.vue'
import CollectionPageTabular from './CollectionPageTabular.vue'

const props = defineProps<{
  source: TCollectionName
}>()


let { collection, loadPage, toggleCollectionView } = useCollectionsStore()
let { tag, derived } = storeToRefs(useItemStore())
const { smAndDown, mdAndDown } = useDisplay()

const viewToIcon = {
  Gallery: 'mdi-image-area',
  Tabular: 'mdi-table-of-contents',
  Chips: 'mdi-dots-horizontal'
}

const meta = computed(() => {
  const c = collection(props.source)
  return c.value.meta
})

const ico = computed(() => {
  return viewToIcon[displayOption.value]
})

const page = computed({
  get: () => { return paginator.value.page },
  set: val => {
    //console.log(`Collection.page.set to ${val}`)
    loadPage(props.source, val, meta.value.view, derived.value.module)
  }
})

const header = computed(() => {
  let pageInfo, headerText = ``
  switch (meta.value.length) {
    case 0:
      pageInfo = `(Empty)`
      break
    case 1:
      pageInfo = `(P1)`
      break
    default:
      pageInfo = `(P${meta.value.pageNoB1}/${meta.value.noOfPages})`
  }

  switch (props.source) {
    case 'main':
      headerText = smAndDown.value ? `Results ${pageInfo}` : `${derived.value.module} Results: page ${pageInfo}, items (${meta.value.firstItemNo}-${meta.value.lastItemNo}/${meta.value.noOfItems})`
      break
    case 'media':
      headerText = smAndDown.value ? `Media ${pageInfo}` : `${derived.value.moduleAndTag} - Media ${pageInfo}`
      break
    case 'related':
      headerText = smAndDown.value ? `Related ${pageInfo}` : `${derived.value.moduleAndTag} - Related ${pageInfo}`
  }
  return headerText
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
    case 'Gallery':
      return CollectionPageGallery
    case 'Chips':
      return CollectionPageChips
    case 'Tabular':
      return CollectionPageTabular
    default:
      console.log(`Collection.vue invalid collectionPage: ${meta.value.viewIndex}`)
      return CollectionPageGallery
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


