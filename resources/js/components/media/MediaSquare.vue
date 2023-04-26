<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card v-bind="props" :color="isHovering ? 'blue' : undefined">
      <v-img :src="media.urls.full" :lazy-src="media.urls.tn" contain aspect-ratio="1" class="bg-grey">
        <v-btn v-if="showTag" class="text-subtitle-1 font-weight-medium black--text" color="grey">{{ tagText }}</v-btn>
        <v-card class="mx-auto" color="transparent" flat>
          <v-card-text class="text-body-1 white--text">
            {{ overlayText }}</v-card-text>
        </v-card>
        <v-overlay v-if="isHovering">
          <template #activator="{ isActive, props }">
            <component v-bind:is="overlay" :source="source" :itemIndex="itemIndex" :details="details"></component>
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
import { TImageableDetailsMain, TImageableDetailsMedia, TImageableDetails } from '../../types/mediaTypes'

import OverlayRelated from './OverlayRelated.vue'
import OverlayCMedia from './OverlayCMedia.vue'
import OverlayMediaEdit from './OverlayMediaEdit.vue'
import OverlayCMain from './OverlayCMain.vue'
import { ItemNotFoundError } from '@/js/scripts/setups/routes/errors'
import { TMedia } from '@/js/types/mediaTypes'


const props = defineProps<{
  source: TCollectionName,
  itemIndex: number,
  media: TMedia
  details: TImageableDetails
  size?: number
}>()

onMounted(() => {
  console.log(`MediaSquare.onMounted props: ${JSON.stringify(props, null, 2)}`)
})

const showTag = computed(() => {
  return props.source === 'main'
})
const tagText = computed(() => {
  switch (props.source) {
    case 'main':
      return (<TImageableDetailsMain>props.details).tag

    case 'media':
      return ""
  }

})

const overlayText = computed(() => {
  switch (props.source) {
    case 'main':
      return (<TImageableDetailsMain>props.details).description

    case 'media':
      return `MediaSquare overlaytext`
  }
})

const overlay = computed(() => {
  console.log(`MediaSquare.overlay`)
  switch (props.source) {
    case 'main':
      return OverlayCMain
    case 'media':
      return OverlayCMedia
    case 'related':
      return OverlayRelated
  }
})

</script>

