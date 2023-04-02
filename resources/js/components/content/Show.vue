<template>
  <v-container fluid>
    <component :is="view"></component>
  </v-container>
</template>

<script lang="ts" setup>

import { computed } from 'vue'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import { useItemStore } from '../../scripts/stores/item'
import ItemCard from '../item/item-views/ItemCard.vue'
import ShowView0 from '../item/layouts/ShowView0.vue'
import ShowView1 from '../item/layouts/ShowView1.vue'
import ShowView2 from '../item/layouts/ShowView2.vue'

let is = useItemStore()

const view = computed(() => {
  switch (is.itemViewIndex) {
    case 0:
      return ShowView0
    case 1:
      return ShowView1
    case 2:
      return ShowView2
  }
})


</script>
