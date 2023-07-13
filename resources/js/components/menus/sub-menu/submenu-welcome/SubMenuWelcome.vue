<template>
  <FilterButton/>
  <CollectionButton/>
  <v-btn class="primary--text" large variant="outlined" @click="showClicked()">
    Show Item<v-tooltip activator="parent" location="bottom left">Go to the first item</v-tooltip></v-btn>
</template>


<!-- <v-tooltip activator="parent" location="bottom left">{{ collectionTipText }}</v-tooltip> -->

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import FilterButton from '../lhs-buttons/FilterButton.vue'
import CollectionButton from '../lhs-buttons/CollectionButton.vue'
import { useCollectionsStore } from '../../../../scripts/stores/collections/collections'
import { useRoutesMainStore } from '../../../../scripts/stores/routes/routesMain'




const { current } = storeToRefs(useRoutesMainStore())
const router = useRouter()

async function showClicked() {
  const { firstSlug } = useCollectionsStore()
  const firstUid = await firstSlug()
  if (firstUid) {
    router.push({ name: 'show', params: { module: current.value.url_module, slug: firstUid } })
  } else {
    console.log(`failed to get first slug`)
  }
}

</script>
