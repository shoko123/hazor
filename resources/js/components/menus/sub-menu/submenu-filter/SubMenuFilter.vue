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
import { useTrioStore } from '../../../../scripts/stores/trio';
import { useRouter } from 'vue-router'
import { useRoutesParserStore } from '../../../../scripts/stores/routes/routesParser'

let { current } = storeToRefs(useRoutesMainStore())
let { clearFilters, groupsWithASelectedParam } = useTrioStore()
const { serializeQueryParams } = useRoutesParserStore()
const router = useRouter()

const name = computed(() => {
  return current.value.module
})

function submit() {
  console.log(`filter.submit()`);
  let query = serializeQueryParams(groupsWithASelectedParam('Filter'));

  router.push({ name: 'index', params: { module: current.value.url_module }, query })
}

async function getCount() {
  console.log(`getCount()`);
  //let query = serializeQueryParams(groupsWithASelectedParam('Filter'));
  //router.push({ name: 'index', params: { module: current.value.url_module }, query })
}
function clear() {
  console.log(`filter.clear()`);
  clearFilters()
};
</script>