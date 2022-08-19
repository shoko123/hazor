<template>
  <v-btn class="primary--text" large outlined v-for="(btn, index) in buttons" :key="index"
    @click="btnClicked(btn.routeName)">{{ btn.text }}</v-btn>
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
  btns.push({ text: "Welcome", routeName: "welcome" });
  btns.push({ text: "Filter", routeName: "filter" });
  return btns;
});

function btnClicked(routeName: string) {
      router.push({ name: 'filter', params: { module: routeName } })
}
</script>
