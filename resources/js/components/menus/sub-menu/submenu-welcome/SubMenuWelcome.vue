<template>
  <FilterButton/>
  <CollectionButton/>
  <v-btn class="primary--text" large variant="outlined" @click="showClicked()">
    Show Item<v-tooltip activator="parent" location="bottom left">Go to the first item</v-tooltip></v-btn>
</template>

<script lang="ts" setup>
import FilterButton from '../lhs-buttons/FilterButton.vue'
import CollectionButton from '../lhs-buttons/CollectionButton.vue'
import { useCollectionsStore } from '../../../../scripts/stores/collections/collections'
import { useRoutesMainStore } from '../../../../scripts/stores/routes/routesMain'

const { routerPush } = useRoutesMainStore()

async function showClicked() {
  const { firstSlug } = useCollectionsStore()
  const firstUid = await firstSlug()
  if (firstUid) {
    routerPush('show', firstUid) 
  } else {
    console.log(`failed to get first slug`)
  }
}
</script>
