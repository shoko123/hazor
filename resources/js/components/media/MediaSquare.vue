<template>
  <div v-if="item">
    <v-hover>
      <template v-slot:default="{ hover }">
        <v-card class="mx-auto" max-width="size" max-height="size">
          <v-img
            :src="item.urls?.full"
            :lazy-src="item.urls?.tn"
            contain
            aspect-ratio="1"
            class="grey lighten-2"
          >
            <v-btn
              v-if="tagText"
              class="text-subtitle-1 font-weight-medium black--text"
              color="grey"
              >{{ tagText }}</v-btn
            >
            <v-card class="mx-auto"  color="transparent" flat>
              <v-card-text class="text-body-1 white--text">
                {{ overlayText }}</v-card-text
              >
            </v-card>
          </v-img>
          <v-fade-transition>
            <v-overlay v-if="hover" absolute color="#036358">
              <component
                v-bind:is="overlay"
               
              ></component>
            </v-overlay>
          </v-fade-transition>
        </v-card>
      </template>
    </v-hover>
  </div>
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
  caller: string, 
  item: IMediaItem
}>()

const tagText = computed(() => {
  return props.item.tag

  // switch (this.source) {
  //       case "main":
  //       case "related":
  //         return this.item.tag;

  //       case "media":
  //         if (this.caller === "mediaPrimary") {
  //           let c = this.$store.getters["mgr/collections"]("media");
  //           return `media (${c.collection.length})`;
  //         } else {
  //           return "";
  //         }
  //     }
})

const overlayText = computed(() => {
  return props.item.description

  // switch (this.source) {
  //       case "main":
  //       case "related":
  //         if (!this.item.hasMedia) {
  //           let text = this.item.description;
  //           if (text === null || text === undefined) {
  //             return "";
  //           } else {
  //             return text.length < 101 ? text : text.substr(0, 100) + "...";
  //           }
  //         }

  //       case "media":
  //         return "";
  //     }
})

const overlay = computed(() => {
  return OverlayItemMedia
  //  switch (props.source) {
  //       case "main":
  //         return OverlayCollectionItem;
  //       case "related":
  //         return OverlayRelated;
  //       case "media":
  //         // return this.$store.getters["mgr/status"].isMediaEdit
  //         true
  //           ? OverlayMediaEdit
  //           : OverlayItemMedia;
  //     }
  return props.item.tag
})

</script>

