<template>
  <v-list-item @click="toWelcome">
    Welcome
  </v-list-item>
  <v-list-item @click="toFilter">
    Filter
  </v-list-item>
  <v-list-item @click="toCollection">
    Collection
  </v-list-item>
  <v-list-item @click="toggle">
    Toggle View
  </v-list-item>
  <v-divider />
  <v-list-item>Please Note: Editing is disabled on small devices!</v-list-item>
</template>

<script lang="ts" setup>

import { computed } from 'vue'
import { useItemStore } from '../../../../scripts/stores/item'

import { useRoutesMainStore } from '../../../../scripts/stores/routes/routesMain'
import { useCollectionsStore } from '../../../../scripts/stores/collections/collections'

const { routerPush } = useRoutesMainStore()
const is = useItemStore()

function toCollection() {
  routerPush('index')
}

function toFilter() {
  routerPush('filter')
}

function toWelcome() {
  routerPush('welcome')
}

function toggle() {
  is.itemViewIndex = (is.itemViewIndex + 1) % is.itemViews.length
}

</script>
