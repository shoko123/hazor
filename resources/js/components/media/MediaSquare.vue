<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card v-bind="props" :color="isHovering ? 'blue' : undefined">
      <v-img :src="media.urls.full" :lazy-src="media.urls.tn" aspect-ratio="1" id="img" class="bg-grey-lighten-2">
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
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'


let { current } = storeToRefs(useRoutesMainStore())
const props = defineProps<{
  source: TCollectionName,
  itemIndex: number,
  media: TMedia
  details: TImageableDetails
  size?: number
}>()

onMounted(() => {
  //console.log(`MediaSquare.onMounted props: ${JSON.stringify(props, null, 2)}`)
})

const showTag = computed(() => {
  return props.source === 'main'
})

const cover = computed(() => {
  return !props.media.hasMedia
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
      return ``
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
<style scoped>
#img {
  border: 2px solid #555;
}

</style>
