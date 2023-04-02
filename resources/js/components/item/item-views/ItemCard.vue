<template>
  <v-card class="elevation-12">
    <v-card-title id="title" class="grey py-0 mb-4">{{ title }}</v-card-title>
    <v-card-text>
      <component :is="itemForm"></component>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup >
import { computed } from 'vue'
import { useRoutesMainStore } from '../../../scripts/stores/routes/routesMain'
import { storeToRefs } from 'pinia'

import LocusForm from '../../modules/loci/LocusForm.vue'
import StoneForm from '../../modules/stones/StoneForm.vue'
import FaunaForm from '../../modules/fauna/FaunaForm.vue'
import { useItemStore } from '../../../scripts/stores/item'

let { tag } = storeToRefs(useItemStore())
let { getModule } = useRoutesMainStore()

const itemForm = computed(() => {
  switch (getModule()) {
    case 'Locus':
      return LocusForm
    case 'Stone':
      return StoneForm
    case 'Fauna':
      return FaunaForm
  }
})

const title = computed(() => {
  return `${getModule()}  ${tag.value} details`
})






</script>
<style scoped>
#title {
  background-color: grey;
}
</style>
