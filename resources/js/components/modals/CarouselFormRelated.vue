

<template>
  <v-card-text>
    <v-row class="text-body-1">
      {{ item?.short }}</v-row>
  </v-card-text>
  <v-card-actions>
    <v-btn @click="clicked" variant="outlined">{{ item?.module }} {{ item?.tag }}</v-btn>
  </v-card-actions>
</template>

<script lang="ts" setup >
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { type TModule } from '@/js/types/routesTypes'
import { type TCarouselRelated } from '@/js/types/mediaTypes'


import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import { useCarouselStore } from '../../scripts/stores/modals/carousel'

const { routerPush } = useRoutesMainStore()
const { close } = useCarouselStore()
const { itemDetails } = storeToRefs(useCarouselStore())


const item = computed(() => {
  return <TCarouselRelated | null>itemDetails.value
})

async function clicked() {
  await close()
  routerPush('show', <string>item.value?.slug, <TModule>item.value?.module)
}
</script>
