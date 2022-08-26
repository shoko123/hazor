<template>
    <v-app-bar :height="36" color=orange dark app>
        <v-app-bar-title>
            <component :is="sub"></component>
        </v-app-bar-title>
    </v-app-bar>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import SubWelcome from './SubWelcome.vue'
import SubIndex from './SubIndex.vue'
import { useRoutesStore } from '../../scripts/stores/routes/routesMain'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
const { current } = storeToRefs(useRoutesStore())

const sub = computed(() => {
    switch (current.value.name) {
        case 'welcome':
            return SubWelcome
        case 'index':
            return SubIndex
        default:
            return SubWelcome

    }
})

</script>