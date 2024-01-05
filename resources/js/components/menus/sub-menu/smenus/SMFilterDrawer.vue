<template>
  <v-list-item @click="submit">Submit</v-list-item>
  <v-list-item @click="getCount">Get Count</v-list-item>
  <v-list-item @click="clear">clear</v-list-item>
  <v-list-item :to="{ name: 'welcome', params: { module } }">welcome</v-list-item>
</template>

<script lang="ts" setup >
import { computed, } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoutesMainStore } from '../../../../scripts/stores/routes/routesMain'
import { useTrioStore } from '../../../../scripts/stores/trio/trio'
import { useFilterStore } from '../../../../scripts/stores/trio/filter'
import { useRouter } from 'vue-router'


let { current } = storeToRefs(useRoutesMainStore())
let trio = useTrioStore()
let { filtersToQueryObject, clearSelectedFilters } = useFilterStore()
const router = useRouter()

const module = computed(() => {
  return current.value.url_module
})

function submit() {
  console.log(`filter.submit()`);
  const query = filtersToQueryObject()
  trio.resetCategoryAndGroupIndices()
  router.push({ name: 'index', params: { module: current.value.url_module }, query })
}

async function getCount() {
  console.log(`getCount()`);
}
function clear() {
  console.log(`filter.clear()`);
  trio.resetCategoryAndGroupIndices()
  clearSelectedFilters()
}
</script>