<template>

  <v-btn @click="next(false)" icon="mdi-arrow-left" color="primary"> </v-btn>

  <Picker />

  <v-btn @click="next(true)" icon="mdi-arrow-right" color="primary"></v-btn>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { storeToRefs } from 'pinia'
import { useRoutesMainStore } from '../../../../scripts/stores/routes/routesMain'
import { useCollectionsStore } from '../../../../scripts/stores/collections/collections'
import { useItemStore } from '../../../../scripts/stores/item'
import Picker from "./picker/Picker.vue"

const { current } = storeToRefs(useRoutesMainStore())

const router = useRouter()





const disableAdjacents = computed(() => {
  return false
})

const isLocus = computed(() => {
  return false
})

const isFind = computed(() => {
  return `I am the "Show" submenu`
})

const isAreaSeason = computed(() => {
  return `I am the "Show" submenu`
})

const item = computed(() => {
  return `I am the "Show" submenu`
})

const header = computed(() => {
  return `I am the "Show" submenu`
})


function next(isRight: boolean) {
  let { nextUrlId } = useItemStore()
  let urlId = nextUrlId(isRight)
  console.log(`goTo ${urlId}`)
  router.push({ name: 'show', params: { module: current.value.url_module, url_id: urlId } })  
}


</script>

<style scoped>

.min_width {
  min-width: 500px;
}
</style>