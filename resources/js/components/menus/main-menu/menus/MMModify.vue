<template>
    {{ title }}
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoutesMainStore } from '../../../../scripts/stores/routes/routesMain'
import { useItemStore } from '../../../../scripts/stores/item'
let rm = useRoutesMainStore()
let it = useItemStore()
const title = computed(() => {
  const itemText = `${rm.current.module} ${it.tag}`
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

