<template>
  <v-container fluid pa-0>
      <component v-bind:is="data.overlay" :source="source" :itemIndex="itemIndex" :hasMedia="data.hasMedia"></component>
  </v-container>
</template>

<script lang="ts" setup >
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { TCollectionName, TPageMainGallery, TPageRelatedGallery, TPageMediaGallery } from '../../types/collectionTypes'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import { useCollectionsStore } from '../../scripts/stores/collections/collections'

import OverlayRelated from './OverlayRelated.vue'
import OverlayCMedia from './OverlayCMedia.vue'
import OverlayMediaEdit from './OverlayMediaEdit.vue'
import OverlayCMain from './OverlayCMain.vue'

const props = defineProps<{
  source: TCollectionName,
  itemIndex: number,
}>()

const { current } = storeToRefs(useRoutesMainStore())
const { collection } = useCollectionsStore()

onMounted(() => {
  //console.log(`MediaSquare.onMounted props: ${JSON.stringify(props, null, 2)}`)
})

const record = computed(() => {
  const c = collection(props.source)
  let indexInPage = props.itemIndex % c.value.meta.itemsPerPage
  let record = c.value.page[indexInPage]
  return record
})

const data = computed(() => {
  switch (props.source) {
    case 'main':
      let ma = record.value as TPageMainGallery
      return {
        overlay: OverlayCMain,
        hasMedia: ma.media.hasMedia,
        record: ma
      }

    case 'media':
      let med = record.value as TPageMediaGallery
      return {
        overlay: current.value.name === 'media' ? OverlayMediaEdit : OverlayCMedia,
        hasMedia: true,
        record: med
      }

    case 'related':
      let rel = record.value as TPageRelatedGallery
      return {
        overlay: OverlayRelated,
        hasMedia: rel.media.hasMedia,
        record: rel
      }
  }
})

</script>

