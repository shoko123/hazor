<template>
  <v-container fluid>
    <ItemCard />
  </v-container>
</template>

<script lang="ts" setup>

import { computed } from 'vue'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'

import ItemCard from '../item/item-views/ItemCard.vue'
let { getModule } = useRoutesMainStore()



</script>
