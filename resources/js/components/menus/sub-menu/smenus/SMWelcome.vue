<template>
  <div class="hidden-sm-and-down">
    <FilterButton />
    <CollectionButton />
    <v-btn variant="outlined" @click="showClicked()">
      Show Item<v-tooltip activator="parent" location="bottom left">Go to the first item</v-tooltip></v-btn>
  </div>
</template>

<script lang="ts" setup>
import FilterButton from '../elements/FilterButton.vue'
import CollectionButton from '../elements/CollectionButton.vue'
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
