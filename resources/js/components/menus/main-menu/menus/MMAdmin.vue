<template>
  {{ name }} - Modify
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoutesMainStore } from '../../../../scripts/stores/routes/routesMain'

let { getModule } = useRoutesMainStore()
const name = computed(() => {
  return getModule()
})
</script>

