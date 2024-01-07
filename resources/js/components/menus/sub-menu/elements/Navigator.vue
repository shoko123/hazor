<template>
  <v-btn :disabled="inTransition" @click="next(false)" icon="mdi-arrow-left" color="blue-lighten-4" large rounded="0"
    variant="flat"> </v-btn>
  <v-btn color="blue-lighten-2" large rounded="0" variant="flat" class="text-none">{{ tag }}</v-btn>
  <v-btn :disabled="inTransition" @click="next(true)" icon="mdi-arrow-right" color="blue-lighten-4" large rounded="0"
    variant="flat"></v-btn>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoutesMainStore } from '../../../../scripts/stores/routes/routesMain'
import { useCollectionMainStore } from '../../../../scripts/stores/collections/collectionMain'
import { useItemStore } from '../../../../scripts/stores/item'

const { nextSlug } = useItemStore()
const { derived, itemIndex } = storeToRefs(useItemStore())
const { routerPush } = useRoutesMainStore()
const { inTransition } = storeToRefs(useRoutesMainStore())
const { extra } = storeToRefs(useCollectionMainStore())

const tag = computed(() => {
  return `${derived.value.tag} (${itemIndex.value + 1}/${extra.value.length})`
})

function next(isRight: boolean) {
  routerPush('show', nextSlug(isRight))
}

</script>
