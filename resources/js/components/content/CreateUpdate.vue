<template>
  <v-container fluid>
    <v-card class="elevation-12">
      <v-card-title id="title" class="grey py-0 mb-4">{{ title }}</v-card-title>
      <v-card-text>
        <component :is="module" :isCreate=props.isCreate></component>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import StoneNew from '../modules/stones/StoneNew.vue'
import FaunaNew from '../modules/fauna/FaunaNew.vue'
import LocusNew from '../modules/loci/LocusNew.vue'

const props = defineProps<{
  isCreate: boolean
}>()


let { current } = storeToRefs(useRoutesMainStore())

onMounted(() => {
  //console.log(`CreateUpdate.props: ${JSON.stringify(props, null, 2)}`)
})

const title = computed(() => {
  return props.isCreate ? "Create" : "Update"
})
const module = computed<Component>(() => {
  switch (current.value.module) {
    case 'Locus':
      return LocusNew
    case 'Stone':
      return StoneNew
    case 'Fauna':
      return FaunaNew
    default:
      console.log(`Update.vue invalid module`)
      return LocusNew
  }
})


</script>
<style scoped>
#title {
  background-color: grey;
}
</style>
