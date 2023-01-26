<template>
  <v-btn class="primary--text" large outlined v-for="(btn, index) in buttons" :key="index"
    @click="btnClicked(btn.method)">{{ btn.text }}</v-btn>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { storeToRefs } from 'pinia'
import { useCollectionsStore } from '../../scripts/stores/collections'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'

const { current } = storeToRefs(useRoutesMainStore())
const router = useRouter()
const buttons = computed(() => {
  let btns = [];
  btns.push({ text: "Filter", method: "filter" });
  btns.push({ text: "Show All", method: "showAll" });
  btns.push({ text: "Show Item", method: "showItem" });
  return btns;
});

async function btnClicked(f: string) {
  switch (f) {
    case "showAll":
      router.push({ name: 'index', params: { module: current.value.url_module } })
      break
    case 'filter':
      router.push({ name: 'filter', params: { module: current.value.url_module } })
      break

    case 'showItem':
      const { firstUrlId } = useCollectionsStore()
      const firstUid = await firstUrlId()
      if (firstUid) {
        router.push({ name: 'show', params: { module: current.value.url_module, url_id: firstUid } })
      } else {
        console.log(`failed to get first url_id`)
      }
      break
  }
}

</script>
