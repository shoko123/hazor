<template>
  <v-btn @click="next(false)" icon="mdi-arrow-left" color="primary"> </v-btn>
  <v-btn large  variant="outlined" >{{ tag }}</v-btn>
  <v-btn @click="next(true)" icon="mdi-arrow-right" color="primary"></v-btn>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoutesMainStore } from '../../../../scripts/stores/routes/routesMain'
import { useCollectionMainStore } from '../../../../scripts/stores/collections/collectionMain'
import { useItemStore } from '../../../../scripts/stores/item'
let { nextSlug } = useItemStore()
let { derived, itemIndex } = storeToRefs(useItemStore())
const { routerPush } = useRoutesMainStore()
let { extra } = storeToRefs( useCollectionMainStore())

const tag = computed(() => {
  return `${derived.value.module} ${derived.value.tag} (${itemIndex.value + 1}/${extra.value.length})`
})

function next(isRight: boolean) {
   routerPush('show', nextSlug(isRight))   
}


</script>
