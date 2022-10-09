<template>
  {{ subMenuTitle }}
  <v-btn class="primary--text" large outlined @click="submit">Submit</v-btn>
  <v-btn class="primary--text" large outlined @click="clear">clear</v-btn>
</template>

<script lang="ts" setup >
import { computed, } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoutesStore } from '../../scripts/stores/routes/routesMain'
import { useTrioStore } from '../../scripts/stores/trio';
import { useRouter } from 'vue-router'

let { current } = storeToRefs(useRoutesStore())
let { clearFilters } = useTrioStore()
const router = useRouter()

const name = computed(() => {
  return current.value.module
})

const subMenuTitle = computed(() => {
  return `${name.value} Filter Manager`;
})

function submit() {
  console.log(`filter.submit()`);
  router.push({ name: 'index', params: { module: current.value.url_module } })
}

function clear() {
  console.log(`filter.clear()`);
  clearFilters()
};
</script>