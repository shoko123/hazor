<template>
  <v-btn class="primary--text" large variant="outlined" @click="submit">Submit</v-btn>
  <v-btn class="primary--text" large variant="outlined" @click="clear">clear</v-btn>

  <div class="hidden-sm-and-down">
    <v-btn class="primary--text" large variant="outlined" @click="getCount">Get Count</v-btn>
    <WelcomeButton />
  </div>
</template>

<script lang="ts" setup >
import { computed, } from 'vue'
import { storeToRefs } from 'pinia'
const router = useRouter()

import type { TParseQueryData } from '@/js/types/routesTypes'
import WelcomeButton from '../elements/WelcomeButton.vue'
import { useRoutesMainStore } from '../../../../scripts/stores/routes/routesMain'
import { useTrioStore } from '../../../../scripts/stores/trio/trio'
import { useFilterStore } from '../../../../scripts/stores/trio/filter'
import { useRouter } from 'vue-router'
import { useXhrStore } from '../../../../scripts/stores/xhr'
import { useNotificationsStore } from '../../../../scripts/stores/notifications'
let { current } = storeToRefs(useRoutesMainStore())
let trio = useTrioStore()
let { filtersToQueryObject, clearSelectedFilters, urlQueryToApiFilters } = useFilterStore()


function submit() {
  console.log(`filter.submit()`)
  const query = filtersToQueryObject()
  trio.resetCategoryAndGroupIndices()
  router.push({ name: 'index', params: { module: current.value.url_module }, query })
}

async function getCount() {
  const { send } = useXhrStore()
  const { showSnackbar } = useNotificationsStore()
  //console.log(`getCount()`)
  const q = filtersToQueryObject()
  //console.log(`query: ${JSON.stringify(q, null, 2)}`)
  const apiFilters = urlQueryToApiFilters(q)
  //console.log(`apiFilters: ${JSON.stringify(apiFilters, null, 2)}`)

  try {
    let res = await send('model/index', 'post', { model: current.value.module, query: (<TParseQueryData>apiFilters.data).apiFilters })
    console.log(`getCount() - success! count: ${res.data.collection.length}`)
    showSnackbar(`Request count result: ${res.data.collection.length}`)
  }
  catch (err) {
    console.log(`getCount() - failed err: ${JSON.stringify(err, null, 2)}`)
  }

}

function clear() {
  console.log(`filter.clear()`)
  trio.resetCategoryAndGroupIndices()
  clearSelectedFilters()
}
</script>