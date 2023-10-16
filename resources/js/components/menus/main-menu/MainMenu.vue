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
import Auth from './mainmenu-auth/MainMenuAuth.vue'
const { mainMenuType } = storeToRefs(useMenusStore())

const menu = computed(() => {
    switch (mainMenuType.value) {
        case 'Read':
            return Read
        case 'Modify':
            return Modify
        case 'Admin':
            return Admin
        case 'Auth':
            return Auth
        default:
            console.log(`Bad Props to MainMenu`)
            return Read
    }
})

const color = computed(() => {
    switch (mainMenuType.value) {
        case 'Read':
            return 'primary'
        case 'Modify':
            return 'orange'
        case 'Admin':
            return 'red'
        case 'Auth':
            return 'green'
        default:
            return undefined
    }
})
</script>

