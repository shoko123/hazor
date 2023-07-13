<template>
  <v-app-bar-title>
    {{ header }}
  </v-app-bar-title>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoutesMainStore } from '../../../../scripts/stores/routes/routesMain'
let rm = useRoutesMainStore()

const header = computed(() => {
  const itemText = `${rm.current.module} ${rm.current.slug}`
  switch (rm.current.name) {
    case 'media':
      return `** Dig ** : Media Editor for ${itemText}`

    case 'tag':
      return `** Dig ** : Tag Editor for ${itemText}`

    case 'create':
      return `** Dig ** : Create new ${rm.current.module} item`

    case 'update':
      return `** Dig ** : Update ${itemText}`
      
    default:
      return `***** Dig - Modify mode *****`
  }
  
})

</script>

