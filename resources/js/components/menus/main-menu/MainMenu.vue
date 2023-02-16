<template>
  <v-app-bar :height="36" :color="color" dark app>
    <component :is="menu"></component>
  </v-app-bar>
</template>

<script lang="ts" setup>

import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import {useMenusStore} from '../../../scripts/stores/menus'
import Read from './MainMenuRead.vue'
import Modify from './MainMenuModify.vue'
import Admin from './MainMenuAdmin.vue'

const { mainMenuType } = storeToRefs(useMenusStore())

const menu = computed(() => {
    switch (mainMenuType.value) {
        case 'Read':
            return Read
        case 'Modify':
            return Modify
        case 'Admin':
            return Admin
        default:
            return undefined
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
        default:
            return undefined
    }
})
</script>

