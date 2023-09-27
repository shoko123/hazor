<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card v-bind="props" variant="outlined" class="ml-1 mb-1">
      <v-img :src="urls?.tn" :lazy-src="urls?.tn" aspect-ratio="1" class="bg-grey-lighten-2">
        <v-btn v-if="showTag" class="text-subtitle-1 font-weight-medium text-black" color="grey">{{ tagText }}</v-btn>
        <v-card class="mx-auto" color="transparent" flat>
          <v-card-text class="text-body-1 text-black">
            {{ overlayText }}</v-card-text>
        </v-card>
        <v-overlay v-if="isHovering">
          <template #activator="{ isActive, props }">
            <component v-bind:is="overlay" :source="source" :itemIndex="itemIndex"></component>
          </template>
        </v-overlay>
      </v-img>
    </v-card>
  </v-hover>
</template>

<script lang="ts" setup >
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { TCollectionName, TPageCMainVImage, TPageCRelatedVMedia } from '../../types/collectionTypes'
import { TMediaRecord } from '../../types/mediaTypes'
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
  let ma = record.value as TPageCMainVImage
  return ma
})

const mediaRecord = computed(() => {
  if (props.source !== 'media') {
    return null
  }
  let ma = record.value as TMediaRecord
  return ma
})

const relatedRecord = computed(() => {
  if (props.source !== 'related') {
    return null
  }
  let ma = record.value as TPageCRelatedVMedia
  return ma
})

const showTag = computed(() => {
  return ['main', 'related'].includes(props.source)
})

const tagText = computed(() => {
  switch (props.source) {
    case 'main':
      return mainRecord.value?.tag

    case 'related':
      return relatedRecord.value?.relation_name

    default:
      return ""
  }
})

const urls = computed(() => {
  switch (props.source) {
    case 'main':
      return mainRecord.value?.media?.urls

    case 'media':
      return mediaRecord.value?.urls

    case 'related':
      return relatedRecord.value?.media?.urls

    default:
      return { full: "", tn: "" }
  }
})

const overlayText = computed(() => {
  switch (props.source) {
    case 'main':
      return mainRecord.value?.short

    case 'media':
      return ``

    case 'related':
      return `${relatedRecord.value?.module} ${relatedRecord.value?.tag}.  ${relatedRecord.value?.short}`
  }
})

const overlay = computed(() => {
  switch (props.source) {
    case 'main':
      return OverlayCMain
    case 'media':
      return current.value.name === 'media' ? OverlayMediaEdit : OverlayCMedia
    case 'related':
      return OverlayRelated
  }
})

</script>

