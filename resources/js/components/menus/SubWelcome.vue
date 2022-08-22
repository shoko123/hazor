<template>
  <v-btn class="primary--text" large outlined v-for="(btn, index) in buttons" :key="index"
    @click="btnClicked(btn.method)">{{ btn.text }}</v-btn>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { storeToRefs } from 'pinia'
import { useMainStore } from '../../scripts/stores/main'
import { useRoutesStore } from '../../scripts/stores/routes/routesMain'

const { current } = storeToRefs(useRoutesStore())
const router = useRouter()
const buttons = computed(() => {
  let btns = [];
  btns.push({ text: "Filter", method: "filter" });
  btns.push({ text: "Show All", method: "showAll" });
  btns.push({ text: "Show Item", method: "showItem" });
  return btns;
});

function btnClicked(f: string) {
  switch (f) {
    case "showAll":
      router.push({ name: 'index', params: { module: current.value.url_module } })
      break
    case 'filter':

      break

    case 'showItem':

      break
  }
}

</script>
