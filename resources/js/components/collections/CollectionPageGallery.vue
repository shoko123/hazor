<template>
  <v-row wrap no-gutters>
    <v-col v-for="(item, index) in page" :key="index" cols="2">
      <MediaSquare v-bind="{
        source: source,
        itemIndex: itemIndex(index),
      }"></MediaSquare>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup >
import { computed } from 'vue'
import { TCollectionName } from '../../types/collectionTypes'
import { useCollectionsStore } from '../../scripts/stores/collections/collections';
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
  return c.value.page
})

function itemIndex(index: number): number {
  return (props.pageNoB1 - 1) * c.value.meta.itemsPerPage + index
}

</script>
