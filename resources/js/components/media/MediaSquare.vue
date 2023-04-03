<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card v-bind="props" :color="isHovering ? 'blue' : undefined">
      <v-img :src="media.urls.full" :lazy-src="media.urls.tn" contain aspect-ratio="1" class="bg-grey">
        <v-btn class="text-subtitle-1 font-weight-medium black--text" color="grey">{{ tagText }}</v-btn>
        <v-card class="mx-auto" color="transparent" flat>
          <v-card-text class="text-body-1 white--text">
            {{ overlayText }}</v-card-text>
        </v-card>
        <v-overlay v-if="isHovering">
          <template #activator="{ isActive, props }">
            <component v-bind:is="overlay" :source="source" :itemIndex="itemIndex" :media="media" :details="details"></component>
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
import { TCollectionName } from '../../types/collectionTypes'
import { TMediaDetailsCMain, TMediaDetailsCMedia } from '../../types/mediaTypes'

import OverlayRelated from './OverlayRelated.vue'
import OverlayItemMedia from './OverlayItemMedia.vue'
import OverlayMediaEdit from './OverlayMediaEdit.vue'
import OverlayCollectionItem from './OverlayCollectionItem.vue'
import { ItemNotFoundError } from '@/js/scripts/setups/routes/errors'
import { TMedia } from '@/js/types/mediaTypes'


const props = defineProps<{
  source: TCollectionName,
  itemIndex: number,
  media: TMedia
  details: TMediaDetailsCMain | TMediaDetailsCMedia
  size?: number
}>()

const show = computed(() => {
  return true
})
const tagText = computed(() => {
  return (<TMediaDetailsCMain>props.details).tag
})

const overlayText = computed(() => {
  return props.details.description
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

