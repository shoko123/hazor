<template>
  <v-container fluid>
    <component v-bind:is="componentName"></component>
  </v-container>
</template>

<script lang="ts" setup>

import { computed } from 'vue'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import LocusForm from '../modules/loci/LocusForm.vue'
import StoneForm from '../modules/stones/StoneForm.vue'
import FaunaForm from '../modules/fauna/FaunaForm.vue'
let { getModule } = useRoutesMainStore()

const componentName = computed(() => {
  switch (getModule()) {
    case 'Locus':
      return LocusForm
    case 'Stone':
      return StoneForm
    case 'Fauna':
      return FaunaForm

  }
})

</script>
