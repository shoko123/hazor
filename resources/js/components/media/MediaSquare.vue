<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card v-bind="props" variant="outlined" class="ml-1 mb-1">
      <v-img :src="data.urls?.tn" :lazy-src="data.urls?.tn" aspect-ratio="1" class="bg-grey-lighten-2">
        <v-btn v-if="data.showTag" class="text-subtitle-1 font-weight-medium text-black" color="grey">{{ data.tagText }}</v-btn>
        <v-card class="mx-auto" color="transparent" flat>
          <v-card-text class="text-body-1 text-black">
            {{ data.overlayText }}</v-card-text>
        </v-card>
        <v-overlay v-if="isHovering">
          <template #activator="{ isActive, props }">
            <component v-bind:is="data.overlay" :source="source" :itemIndex="itemIndex" :hasMedia="data.hasMedia"></component>
          </template>
        </v-overlay>
      </v-img>
    </v-card>
  </v-hover>
</template>

<script lang="ts" setup >
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { TCollectionName, TPageMainGallery, TPageRelatedGallery, TPageMediaGallery } from '../../types/collectionTypes'
import { useCollectionMainStore } from '../../scripts/stores/collections/collectionMain'
import { useCollectionMediaStore } from '../../scripts/stores/collections/collectionMedia'
import { useCollectionRelatedStore } from '../../scripts/stores/collections/collectionRelated'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import OverlayRelated from './OverlayRelated.vue'
import OverlayCMedia from './OverlayCMedia.vue'
import OverlayMediaEdit from './OverlayMediaEdit.vue'
import OverlayCMain from './OverlayCMain.vue'

let { current } = storeToRefs(useRoutesMainStore())
const main = useCollectionMainStore()
const media = useCollectionMediaStore()
const related = useCollectionRelatedStore()

const props = defineProps<{
  source: TCollectionName,
  itemIndex: number,
}>()

onMounted(() => {
  //console.log(`MediaSquare.onMounted props: ${JSON.stringify(props, null, 2)}`)
})

const collection = computed(() => {
  switch (props.source) {
    case 'main':
      return main

    case 'media':
      return media

    case 'related':
      return related
  }
})

const record = computed(() => {
  let ipp = collection.value.ipp
  let indexInPage = props.itemIndex % ipp
  let record = collection.value.page[indexInPage]
  return record
})

const mainRecord = computed(() => {
  if (props.source !== 'main') {
    return null
  }
  let ma = record.value as TPageMainGallery
  return ma
})

const mediaRecord = computed(() => {
  if (props.source !== 'media') {
    return null
  }
  let ma = record.value as TPageMediaGallery
  return ma
})

const relatedRecord = computed(() => {
  if (props.source !== 'related') {
    return null
  }
  let ma = record.value as TPageRelatedGallery
  return ma
})

const data = computed(() => {
  switch (props.source) {
    case 'main':
      return {
        overlay: OverlayCMain,
        showTag: true,
        tagText: mainRecord.value?.tag,
        urls: mainRecord.value?.media?.urls,
        hasMedia: mainRecord.value?.media?.hasMedia,
        overlayText: mainRecord.value?.short
      }

    case 'media':
    return {
        overlay:  current.value.name === 'media' ? OverlayMediaEdit : OverlayCMedia,
        showTag: false,
        tagText: '',
        urls: mediaRecord.value?.urls,
        hasMedia: true,
        overlayText: ''
      }

    case 'related':
    return {
        overlay: OverlayRelated,
        showTag: true,
        tagText: relatedRecord.value?.relation_name,
        urls: relatedRecord.value?.media?.urls,
        hasMedia: relatedRecord.value?.media?.hasMedia,
        overlayText: `${relatedRecord.value?.module} ${relatedRecord.value?.tag}.  ${relatedRecord.value?.short}`
      }
  }
})

</script>

