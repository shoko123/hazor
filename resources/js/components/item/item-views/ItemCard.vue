<template>
  <v-card class="elevation-12">
    <v-card-title id="title" class="grey py-0 mb-4">{{ title }}</v-card-title>
    <v-card-text>
      <div v-if="hasMedia">
        <v-row wrap no-gutters>
          <v-col lg="9">
            <component :is="itemForm"></component>
          </v-col>
          <v-col lg="3" class="px-1">
            <MediaSquare
        v-bind="{
          source: 'media',
          itemIndex: 0,
          media: media,
          details: mediaDetails,        
          size: 250,
        }"
      ></MediaSquare>
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
// {id: i.fields.id, url_id: i.url_id, tag: i.tag, description: "fake description"},  

import { computed } from 'vue'
import { useRoutesMainStore } from '../../../scripts/stores/routes/routesMain'
import { storeToRefs } from 'pinia'
import { useItemStore } from '../../../scripts/stores/item'
import { useMediaStore } from  '../../../scripts/stores/media'

import MediaSquare from '../../media/MediaSquare.vue'
import LocusForm from '../../modules/loci/LocusForm.vue'
import StoneForm from '../../modules/stones/StoneForm.vue'
import FaunaForm from '../../modules/fauna/FaunaForm.vue'

const { buildMedia } = useMediaStore()
let i = useItemStore()




let { tag } = storeToRefs(useItemStore())
let { getModule } = useRoutesMainStore()

const itemForm = computed(() => {
  switch (getModule()) {
    case 'Locus':
      return LocusForm
    case 'Stone':
      return StoneForm
    case 'Fauna':
      return FaunaForm
  }
})

const title = computed(() => {
  return `${getModule()}  ${tag.value} details`
})

const hasMedia = computed(() => {
  return i.media1.hasMedia
})

const media = computed(() => {
  return i.media1
})

const mediaDetails = computed(() => {
  return {
        id: 5,
        collection_name: "photos",
        order_column: 1,
        description: null
  }
})

</script>
<style scoped>
#title {
  background-color: grey;
}
</style>
