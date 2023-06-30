<template>
    <v-app-bar :height="36" dark app>
        <component :is="sub"></component>
    </v-app-bar>
</template>
<script lang="ts" setup>

import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'

import SubWelcome from './submenu-welcome/SubMenuWelcome.vue'
import SubIndex from './submenu-index/SubMenuIndex.vue'
import SubMenuFilter from './submenu-filter/SubMenuFilter.vue'
import SubMenuShow from './submenu-show/SubMenuShow.vue'
import { useRoutesMainStore } from '../../../scripts/stores/routes/routesMain'

const { current } = storeToRefs(useRoutesMainStore())

const sub = computed(() => {
    switch (current.value.name) {
        case 'welcome':
            return SubWelcome
        case 'index':
            return SubIndex
        case 'filter':
            return SubMenuFilter
        case 'show':
            return SubMenuShow
        default:
            return SubWelcome

    }
})

</script>