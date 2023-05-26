<template>
    <v-app-bar :height="36" :color="color" dark app>
        <component :is="menu"></component>
    </v-app-bar>
</template>

<script lang="ts" setup>

import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useMenusStore } from '../../../scripts/stores/menus'
import Read from './mainmenu-read/MainMenuRead.vue'
import Modify from './mainmenu-modify/MainMenuModify.vue'
import Admin from './mainmenu-admin/MainMenuAdmin.vue'
import Media from './mainmenu-media/MainMenuMedia.vue'
const { mainMenuType } = storeToRefs(useMenusStore())

const menu = computed(() => {
    switch (mainMenuType.value) {
        case 'Read':
            return Read
        case 'Modify':
            return Modify
        case 'Admin':
            return Admin
        case 'Media':
            return Media
        default:
            console.log(`Bad Props to MainMenu`)
            return Media
    }
})

const color = computed(() => {
    switch (mainMenuType.value) {
        case 'Read':
            return 'primary'
        case 'Modify':
        case 'Media':
            return 'orange'
        case 'Admin':
            return 'red'
        default:
            return undefined
    }
})
</script>

