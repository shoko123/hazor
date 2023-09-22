<template>
  <v-btn :disabled="rms.inTransition" @click="next(false)" icon="mdi-arrow-left" color="primary"> </v-btn>
  <v-btn large variant="outlined">{{ tag }}</v-btn>
  <v-btn :disabled="rms.inTransition" @click="next(true)" icon="mdi-arrow-right" color="primary"></v-btn>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoutesMainStore } from '../../../../scripts/stores/routes/routesMain'
import { useCollectionMainStore } from '../../../../scripts/stores/collections/collectionMain'
import { useItemStore } from '../../../../scripts/stores/item'

const is = useItemStore()
const rms = useRoutesMainStore()
const { extra } = storeToRefs(useCollectionMainStore())

const tag = computed(() => {
  return `${is.derived.module} ${is.derived.tag} (${is.itemIndex + 1}/${extra.value.length})`
})

function next(isRight: boolean) {
  rms.routerPush('show', is.nextSlug(isRight))
}

</script>
