

<template>
  <v-card-text>
    <v-row class="text-body-1">
      "{{ cs.itemMain?.module }} {{ cs.itemMain?.tag }}" Description:</v-row>
    <v-row class="text-body-1">
      {{ cs.itemMain?.short }}</v-row>
  </v-card-text>
  <v-card-actions>
    <v-btn @click="clicked" variant="outlined">{{ cs.itemMain?.module }} {{ cs.itemMain?.tag }}</v-btn>
  </v-card-actions>
</template>

<script lang="ts" setup >
import { storeToRefs } from 'pinia'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import { useCarouselStore } from '../../scripts/stores/modals/carousel'
const { routerPush } = useRoutesMainStore()
const cs = useCarouselStore()
const { close } = useCarouselStore()
const { itemMain } = storeToRefs(useCarouselStore())

async function clicked() {
  let slug = itemMain.value?.slug
  await cs.close()
  routerPush('show', slug)
}
</script>
