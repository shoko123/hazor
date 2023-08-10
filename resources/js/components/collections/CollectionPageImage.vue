<template>
  <v-row wrap no-gutters>
    <v-col v-for="(item, index) in page" :key="index" cols="2">
      <MediaSquare v-bind="{
          source: source,
          itemIndex: itemIndex(index),
          media: item.media,
          details: { id: item.id, slug: item.slug, tag: item.tag, description: item.description },
          size: 250,
        }"></MediaSquare>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup >
import { storeToRefs } from 'pinia'
import { useCollectionsStore } from '../../scripts/stores/collections/collections';
import { computed } from 'vue'
import { TCollectionView, TCollectionName, TPageCMainVImage, TPageCMediaVImage } from '../../types/collectionTypes'

import MediaSquare from '../media/MediaSquare.vue'

const props = defineProps<{
  source: TCollectionName
  pageNoB1: number
}>()

let { collection } = useCollectionsStore()

const c = computed(() => {
  return collection(props.source).value
})


const page = computed(() => {
  return c.value.page as TPageCMainVImage[]
})


function itemIndex(index: number): number {
  return (props.pageNoB1 - 1) * c.value.meta.itemsPerPage + index
}

function details(item: TPageCMainVImage | TPageCMediaVImage) {

  switch (props.source) {
    case 'main':

      return {
        id: (<TPageCMainVImage>item).id,
        slug: (<TPageCMainVImage>item).slug,
        tag: (<TPageCMainVImage>item).tag,
        description: (<TPageCMainVImage>item).description
      }
    case 'media':
      return {
        tag: (<TPageCMediaVImage>item).tag,
        description: "stam",
      }
  }

}
</script>
