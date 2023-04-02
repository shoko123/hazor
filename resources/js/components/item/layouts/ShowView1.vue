<template>
    <h1>View1</h1>
  <ItemCard />

</template>

<script lang="ts" setup >
import { computed } from 'vue'
import Collection from '../../collections/Collection.vue'
import { TCollectionName } from '../../../types/collectionTypes'
import ItemCard from '../item-views/ItemCard.vue'

const source = computed(() => {
  return "media" as TCollectionName
})



</script>
<style scoped>
#title {
  background-color: grey;
}
</style>
