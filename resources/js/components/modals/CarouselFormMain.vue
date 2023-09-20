

<template>
  <v-card-text>
    <v-row class="text-body-1">
      {{ itemMain?.short }}</v-row>
  </v-card-text>
  <v-card-actions>
    <v-btn @click="clicked" variant="outlined">{{ itemMain?.tag }}</v-btn>
  </v-card-actions>
</template>

<script lang="ts" setup >
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import { useCarouselStore } from '../../scripts/stores/modals/carousel'
const { getRouteInfo } = useRoutesMainStore()
const router = useRouter()
const { close } = useCarouselStore()
const { itemMain } = storeToRefs(useCarouselStore())

async function clicked() {
  const routeInfo = getRouteInfo()
  let slug = itemMain.value?.slug
  await close()
  router.push({ name: 'show', params: { module: routeInfo.value.url_module, slug: slug } })

}
</script>
