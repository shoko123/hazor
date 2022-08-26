<template>
  <v-row wrap>
    <v-chip v-for="(item, index) in page" :key="index" class="font-weight-normal ma-2 body-1" @click="goTo(item)">{{
        item?.tag
    }}</v-chip>
  </v-row>
</template>

<script lang="ts" setup >

import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { TSource, IPageChipItemDisplay } from '../../types/collectionTypes'
import { useCollectionsStore } from '../../scripts/stores/collections'


const props = defineProps<{
  source: TSource
}>()


let { getCollectionDisplayData } = useCollectionsStore()

const page = computed(() => {
  let c = getCollectionDisplayData(props.source)
  //console.log(`CPMedia.page() CollectionDisplayData: ${JSON.stringify(c, null, 2)} source: ${props.source}` )
  return c.page as IPageChipItemDisplay[]
})

function goTo(item: any) {
  console.log("goTo")
}
</script>

