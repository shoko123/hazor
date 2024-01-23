<template>
  <v-list-item @click="toFilter">
    Filter
  </v-list-item>
  <v-list-item @click="toCollection">
    Collection
  </v-list-item>
  <v-list-item @click="toItem">
    Item
  </v-list-item>
</template>

<script lang="ts" setup>

import { useRoutesMainStore } from '../../../../scripts/stores/routes/routesMain'
import { useCollectionsStore } from '../../../../scripts/stores/collections/collections'

const { routerPush } = useRoutesMainStore()

function toCollection() {
  routerPush('index')
}

async function toItem() {
  const { firstSlug } = useCollectionsStore()
  const firstUid = await firstSlug()
  if (firstUid) {
    routerPush('show', firstUid)
  } else {
    console.log(`failed to get first slug`)
  }
}

function toFilter() {
  routerPush('filter')
}

</script>
