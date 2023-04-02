<template>
  <h1>View0</h1>
  <ItemCard />
</template>

<script lang="ts" setup >
import { computed } from 'vue'
import ItemCard from '../item-views/ItemCard.vue'

const trio = computed(() => {
  return "xxx"
})





</script>
<style scoped>
#title {
  background-color: grey;
}
</style>
