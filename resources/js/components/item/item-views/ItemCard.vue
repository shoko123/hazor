<template>
  <v-card class="elevation-12">
    <v-card-title id="title" class="grey py-0 mb-4">Item Form</v-card-title>
    <v-card-text>
      <component :is="itemForm"></component>   
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup >
import { computed } from 'vue'
import { useRoutesMainStore } from '../../../scripts/stores/routes/routesMain'
import LocusForm from '../../modules/loci/LocusForm.vue'
import StoneForm from '../../modules/stones/StoneForm.vue'
import FaunaForm from '../../modules/fauna/FaunaForm.vue'

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

const hasMedia = computed(() => {
  return false
})






</script>
<style scoped>
#title {
  background-color: grey;
}
</style>
