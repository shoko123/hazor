<template>
  <v-row wrap>
    <v-chip v-for="(item, index) in page" :key="index" class="font-weight-normal ma-2 body-1" @click="goTo(item)">{{
    item.tag
    }}</v-chip>
  </v-row>
</template>

<script lang="ts" setup >

import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { TSource, IChipItem } from '../../types/collectionTypes'
import { useCollectionsStore } from '../../scripts/stores/collections'

const props = defineProps<{
  source: TSource
  pageNoB1: number
}>()

let { pageArrayRef } = useCollectionsStore()
const page = computed(() => {
  return pageArrayRef(props.source).value
})

function goTo(item: any) {
  console.log("goTo")
}
</script>

