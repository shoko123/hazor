<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card v-bind="props" :color="isHovering ? 'blue' : undefined">
      <v-img :src="item.media.urls.full" :lazy-src="item.media.urls.tn" contain aspect-ratio="1"
        class="grey lighten-2">
        <v-btn class="text-subtitle-1 font-weight-medium black--text" color="grey">{{ tagText }}</v-btn>
        <v-card class="mx-auto" color="transparent" flat>
          <v-card-text class="text-body-1 white--text">
            {{ overlayText }}</v-card-text>
        </v-card>
        <v-overlay v-if="isHovering">
          <template #activator="{ isActive, props }">
            <component
                v-bind:is="overlay"
                :item="item"
                :source="source"
                :itemIndex="itemIndex"
              ></component>
          </template>
        </v-overlay>
      </v-img>
    </v-card>
  </v-hover>
</template>

<script lang="ts" setup >
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { TCollectionName, IMediaItem } from '../../types/collectionTypes'


import OverlayRelated from './OverlayRelated.vue'
import OverlayItemMedia from './OverlayItemMedia.vue'
import OverlayMediaEdit from './OverlayMediaEdit.vue'
import OverlayCollectionItem from './OverlayCollectionItem.vue'
import { ItemNotFoundError } from '@/js/scripts/setups/routes/errors'

const props = defineProps<{
  source: TCollectionName,
  item: IMediaItem,
  itemIndex: number,
  pageNoB1?: number,
  indexInPage?: number,
  size?: number
}>()

// onMounted(() => {
//   console.log(`MediaSquare.onMounted props: ${JSON.stringify(props, null, 2)}`)
// })

const myProps = computed(() => {
  return props
})

//Runtime verification that we indeed have IMediaItem (and not IChipItem or ITableItem)
const itemHasUrls = computed(() => {
  return typeof props.item.media.urls === 'object'
})

const show = computed(() => {
  return true
})
const tagText = computed(() => {
  return props.item.item.tag
})

const overlayText = computed(() => {
  return props.item.item.description
})

const overlay = computed(() => {
  console.log(`MediaSquare.overlay`)
  switch (props.source) {
    case 'main':
      return OverlayCollectionItem
    case 'media':
      return OverlayItemMedia
    case 'related':
      return OverlayRelated
  }
})

</script>

