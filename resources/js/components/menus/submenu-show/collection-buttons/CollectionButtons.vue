<template>
  <v-container class="ma-0 pa-0 primary--text min_width">
    <v-row>
      <v-btn @click="toWelcome" variant="outlined">
        Welcome
        <v-tooltip activator="parent" location="bottom">{{ welcomeTipText }}</v-tooltip>
      </v-btn>
      <FilterButton v-if="showFilterButton" />

      <v-btn @click="toCollection" variant="outlined">
        Collection
        <v-tooltip activator="parent" location="bottom">{{ welcomeTipText }}</v-tooltip>
      </v-btn>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRoutesMainStore } from '../../../../scripts/stores/routes/routesMain'
import { useModuleStore } from '../../../../scripts/stores/module'
import FilterButton from './FilterButton.vue'

const router = useRouter()
const { getUrlModule } = useRoutesMainStore()

const collectionTipText = computed(() => {
  return `Go to the Collection Page`
})

const welcomeTipText = computed(() => {
  return `Go to the Welcome Page`
})

const showFilterButton = computed(() => {
  return true
})
const resultsText = computed(() => {
  return false
})

const resultsTipText = computed(() => {
  return false
})

const showCollectionLink = computed(() => {
  return false
})

const counterText = computed(() => {
  return 999
})
function toWelcome() {
  console.log(`toWelcome()`)
  router.push({ name: 'welcome', params: { module: getUrlModule() } })  
}

function toCollection() {
  console.log(`toCollection()`)
  router.push({ name: 'index', params: { module: getUrlModule() } })
}


</script>
<style scoped>
.min_width {
  min-width: 300px;
}
</style>