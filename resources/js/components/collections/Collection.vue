<template>
  <v-card class="elevation-12">
    <v-card-title id="collection">{{ header }}
      <v-spacer></v-spacer>
      <v-btn v-if="allowChips" size="small" variant="outlined" @click="toggleDisplayOption()">view: {{
          displayOption
      }}
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-container fluid class="ma-0 pa-0">
        <template v-if="showPaginator">
          <div class="text-center">
            <v-pagination v-if="paginator.show" v-model="page" :length="paginator.pages" :total-visible="20" :disabled="disable">
            </v-pagination>
          </div>
        </template>
        <component :is="collectionPage" source="props.source" />
      </v-container>
    </v-card-text>
  </v-card>
</template>


<script lang="ts" setup >
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { TCollection, TSource, TElement, TItemsPerPage, TView, IArrayItem, IPageMediaItem, IPageTableItem } from '../../types/collectionTypes'

import CollectionPageMedia from './CollectionPageMedia.vue'
import CollectionPageChips from './CollectionPageChips.vue'
import CollectionPageTable from './CollectionPageTable.vue'
import { useRoutesStore } from '../../scripts/stores/routes/routesMain';
import { useCollectionsStore } from '../../scripts/stores/collections';

const props = defineProps<{
  source: TSource
}>()


let { to } = storeToRefs(useRoutesStore())
let collections = useCollectionsStore()

const page = computed({
  get: () => { return paginator.value.page },
  set: val => {
    console.log(`page set to ${val}`)
    collections.setCollectionElement(props.source, 'page', val)
  }
})


const header = computed(() => {
  let dd = collections.getCollectionDisplayData(props.source)
  return `${to.value.module} results. Showing page(${dd.pageNoB1}/${dd.noOfPages}), items(${dd.firstItemNo} - ${dd.lastItemNo}/${dd.noOfItems})`
})

const paginator = computed(() => {
  let dd = collections.getCollectionDisplayData(props.source)
  console.log(`paginator() display: ${JSON.stringify(dd, null, 2)}`);

  return { show: dd.noOfPages > 1
  , page: dd.pageNoB1, pages: dd.noOfPages }
  //return `${to.value.module} results. Showing page(${dd.pageNoB1}/${dd.noOfPages}), items(${dd.firstItemNo}- ${dd.lastItemNo}/${dd.noOfItems})`

  //return status.mainCollectionHeader.value
})
const showPaginator = computed(() => {
  return `CollectionPageMedia`
})

const collectionPage = computed(() => {
  let c = collections.getCollection(props.source)
  switch (c.views[c.viewIndex]) {
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
const allowChips = computed(() => {
  return `CollectionPageMedia`
})


const displayOption = computed(() => {
  let c = collections.getCollection(props.source)
  return c.views[c.viewIndex]
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
  let c = collections.getCollection(props.source)
  //console.log(`toggle display option() collection: ${JSON.stringify(c, null, 2)}\ncurrent: ${c.viewIndex}, next: ${(c.viewIndex + 1)%(c.views.length)}`);
  //c.viewIndex = (c.viewIndex + 1)%(c.views.length)
  collections.setCollectionElement(props.source, 'viewIndex', (c.viewIndex + 1) % (c.views.length))
}

</script>
<style scoped>
#collection {
  background-color: grey;
  max-height: 36px
}
</style>

