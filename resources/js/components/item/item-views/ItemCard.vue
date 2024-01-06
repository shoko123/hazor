<template>
  <v-card class="elevation-12">
    <v-card-title class="bg-grey text-black py-0 mb-4">{{ title }}</v-card-title>
    <v-card-text>
      <div v-if="hasMedia">
        <v-row wrap no-gutters>
          <v-col :cols="widths[0]">
            <component :is="itemForm"></component>
          </v-col>
          <v-col :cols="widths[1]" class="px-1">
            <MediaSquare v-bind="{
              source: 'media',
              itemIndex: 0,
            }"></MediaSquare>
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <component :is="itemForm"></component>
      </div>

    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup >
import {type Component, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDisplay } from 'vuetify'
import { useItemStore } from '../../../scripts/stores/item'
import { useCollectionMediaStore } from '../../../scripts/stores/collections/collectionMedia'

import MediaSquare from '../../media/MediaSquare.vue'
import LocusForm from '../../modules/loci/LocusForm.vue'
import StoneForm from '../../modules/stones/StoneForm.vue'
import FaunaForm from '../../modules/fauna/FaunaForm.vue'

let { array } = storeToRefs(useCollectionMediaStore())
let { derived, tag } = storeToRefs(useItemStore())

const itemForm = computed<Component | null>(() => {
  switch (derived.value.module) {
    case 'Locus':
      return LocusForm
    case 'Stone':
      return StoneForm
    case 'Fauna':
      return FaunaForm
    default:
      console.log(`ItemCard.vue invalid Module`)
      return null
  }
})

const title = computed(() => {
  return `${derived.value.moduleAndTag} - Details`
})

const hasMedia = computed(() => {
  return array.value.length > 0
})

const widths = computed(() => {
  const { smAndDown } = useDisplay()
  return smAndDown.value ? [12, 12] : [9, 3]
})


</script>

