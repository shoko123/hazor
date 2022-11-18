<template>
  <v-container fluid>
    <component v-bind:is="componentName"></component>
  </v-container>
</template>

<script lang="ts" setup>

import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useModuleStore } from '../../scripts/stores/module'
import LocusForm from '../modules/loci/LocusForm.vue'
import StoneForm from '../modules/stones/StoneForm.vue'
import FaunaForm from '../modules/fauna/FaunaForm.vue'
let { name } = storeToRefs(useModuleStore())

const componentName = computed(() => {
  switch (name.value) {
    case 'Locus':
      return LocusForm
    case 'Stone':
      return StoneForm
    case 'Fauna':
      return FaunaForm

  }
})

</script>
