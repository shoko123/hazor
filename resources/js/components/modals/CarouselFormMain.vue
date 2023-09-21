

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
import { storeToRefs } from 'pinia'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import { useCarouselStore } from '../../scripts/stores/modals/carousel'
const { routerPush } = useRoutesMainStore()
const { close } = useCarouselStore()
const { itemMain } = storeToRefs(useCarouselStore())

async function clicked() {
  let slug = itemMain.value?.slug
  await close()
  routerPush('show', slug)
}
</script>
