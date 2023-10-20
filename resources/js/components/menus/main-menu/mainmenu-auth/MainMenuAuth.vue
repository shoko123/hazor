<template>
    <v-app-bar-title>
        <v-btn :disabled="disable" :to="{ name: 'home' }">
            Hazor (Auth)
        </v-btn>
    </v-app-bar-title>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoutesMainStore } from '../../../../scripts/stores/routes/routesMain'

let { current } = storeToRefs(useRoutesMainStore())

const disable = computed(() => {
    return current.value.name === 'reset-password'
})
</script>

