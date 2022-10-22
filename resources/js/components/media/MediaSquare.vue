<template>
  <v-card class="mx-auto" max-width="size" max-height="size">
    <v-img v-if="itemHasUrls" :src="item.urls.full" :lazy-src="item.urls.tn" contain aspect-ratio="1"
      class="grey lighten-2">
      <v-btn class="text-subtitle-1 font-weight-medium black--text" color="grey">{{ tagText }}</v-btn>
      <v-card class="mx-auto" color="transparent" flat>
        <v-card-text class="text-body-1 white--text">
          {{ overlayText }}</v-card-text>
      </v-card>
    </v-img>
  </v-card>

</template>

<script lang="ts" setup >
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { TSource, IMediaItem } from '../../types/collectionTypes'


import OverlayRelated from './OverlayRelated.vue'
import OverlayItemMedia from './OverlayItemMedia.vue'
import OverlayMediaEdit from './OverlayMediaEdit.vue'
import OverlayCollectionItem from './OverlayCollectionItem.vue'
import { ItemNotFoundError } from '@/js/scripts/setups/routes/errors'

const props = defineProps<{
  source: TSource,
  item: IMediaItem,
  pageNoB1?: number,
  indexInPage?: number,
  size?: number
}>()

//Runtime verification that we indeed have IMediaItem (and not IChipItem or ITableItem)
const itemHasUrls = computed(() => {
  return typeof props.item.urls === 'object'
})

const tagText = computed(() => {
  return props.item.tag
})

const overlayText = computed(() => {
  return props.item.description
})

const overlay = computed(() => {
  return props.item.tag
})

</script>

