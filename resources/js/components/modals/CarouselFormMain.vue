

<template>
  <v-card-text>
    <v-row class="text-body-1">
     {{item?.short}}</v-row>
  </v-card-text>
  <v-card-actions>
    <v-btn @click="clicked" variant="outlined">{{ item?.tag }}</v-btn>
  </v-card-actions>
</template>

<script lang="ts" setup >
import { TCarouselMain } from '@/js/types/mediaTypes'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import { useCarouselStore } from '../../scripts/stores/modals/carousel'
const { getRouteInfo } = useRoutesMainStore()
const router = useRouter()
const c = useCarouselStore()

const item = computed(() => {
  return <TCarouselMain | null>c.itemDetails
})

const tag = computed(() => {
  return  item?.value?.tag
})

async function clicked() {
  const routeInfo = getRouteInfo()
  await c.close()
  router.push({ name: 'show', params: { module: routeInfo.value.url_module, slug: item.value?.slug } })
}
</script>
