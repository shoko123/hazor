<template>
    <v-app-bar-title>
      <v-btn :to="{ name: 'home' }">Hazor (Auth)</v-btn>
    </v-app-bar-title>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoutesMainStore } from '../../../../scripts/stores/routes/routesMain'

let { getModule } = useRoutesMainStore()
const name = computed(() => {
    return getModule()
})
</script>

