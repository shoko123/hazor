

<template>
  <v-card-text>
    <v-row class="text-body-1">
     {{item?.short}}</v-row>
  </v-card-text>
  <v-card-actions>
    <v-btn @click="clicked" variant="outlined">{{ item?.module }} {{item?.tag }}</v-btn>
  </v-card-actions>
</template>

<script lang="ts" setup >
import { TCarouselRelated } from '@/js/types/mediaTypes'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { defineStore, storeToRefs } from 'pinia'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import { useCarouselStore } from '../../scripts/stores/modals/carousel'
const { getRouteInfo } = useRoutesMainStore()
const router = useRouter()
const {close} = useCarouselStore()
const {itemDetails } = storeToRefs(useCarouselStore())


const item = computed(() => {
  return <TCarouselRelated | null>itemDetails.value
})

async function clicked() {
  const routeInfo = getRouteInfo()
  await close()
  router.push({ name: 'show', params: { module: routeInfo.value.url_module, slug: item.value?.slug } })
}
</script>
