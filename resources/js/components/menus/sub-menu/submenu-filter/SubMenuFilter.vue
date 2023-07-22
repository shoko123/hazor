<template>
  <v-btn class="primary--text" large variant="outlined" @click="submit">Submit</v-btn>
  <v-btn class="primary--text" large variant="outlined" @click="getCount">Get Count</v-btn>  
  <v-btn class="primary--text" large variant="outlined" @click="clear">clear</v-btn>
  <WelcomeButton/>
</template>

<script lang="ts" setup >
import { computed, } from 'vue'
import { storeToRefs } from 'pinia'
import WelcomeButton from '../lhs-buttons/WelcomeButton.vue'
import { useRoutesMainStore } from '../../../../scripts/stores/routes/routesMain'
import { useTrioStore } from '../../../../scripts/stores/trio/trio'
import { useFilterStore } from '../../../../scripts/stores/trio/filter'
import { useRouter } from 'vue-router'

let { current } = storeToRefs(useRoutesMainStore())
let trio = useTrioStore()
let filter = useFilterStore()
const router = useRouter()

function submit() {
  console.log(`filter.submit()`);
  const query = filter.filtersToQueryObject()
  router.push({ name: 'index', params: { module: current.value.url_module }, query })
}

async function getCount() {
  console.log(`getCount()`);
}
function clear() {
  console.log(`filter.clear()`);
  trio.clearSelected('Filter')
  filter.clearSelectedFilters()
}
</script>