<template>
  <v-btn @click="toCollection" variant="outlined">
    Collection
    <v-tooltip activator="parent" location="bottom left">{{ tip }}</v-tooltip>
  </v-btn>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRoutesMainStore } from '../../../../scripts/stores/routes/routesMain'
import { useModuleStore } from '../../../../scripts/stores/module'
import FilterButton from './FilterButton.vue'

const router = useRouter()
const { getUrlModule } = useRoutesMainStore()

const tip = computed(() => {
  return `Go to the Collection Page`
})

function toCollection() {
  //console.log(`toCollection()`)
  router.push({ name: 'index', params: { module: getUrlModule() } })
}
</script>