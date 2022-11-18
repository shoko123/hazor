<template>
  {{  header  }}
  <v-btn class="primary--text" large outlined v-for="(btn, index) in buttons" :key="index"
    @click="btnClicked(btn.routeName)">{{ btn.text }}</v-btn>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { storeToRefs } from 'pinia'
import { useMainStore } from '../../../scripts/stores/main'
import { useRoutesMainStore } from '../../../scripts/stores/routes/routesMain'

const { current } = storeToRefs(useRoutesMainStore())
const router = useRouter()

const buttons = [{ text: "show", routeName: "welcome" }, { text: "show", routeName: "filter" }]

const header = computed(() => {
  return `I am the "Show" submenu`
})

function btnClicked(routeName: string) {
  router.push({ name: routeName, params: { module: current.value.url_module } })
}
</script>
