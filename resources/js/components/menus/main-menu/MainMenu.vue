<template>
    <v-app-bar :height="35" :color="menu.color" dark>
        <v-app-bar-nav-icon class="hidden-md-and-up" @click="showDrawer = !showDrawer"></v-app-bar-nav-icon>
        <component :is="menu.lhs"></component>
        <template v-slot:append>
            <component :is="menu.rhs"></component>
        </template>
    </v-app-bar>

    <v-navigation-drawer v-model="showDrawer" temporary color="blue-grey darken-4">
        <component :is="menu.drawer"></component>
    </v-navigation-drawer>
</template>

<script lang="ts" setup>

import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useMenusStore } from '../../../scripts/stores/menus'
import MMLoginOrUser from './mainmenu-read/MMLoginOrUser.vue'
import ReadLhs from './mainmenu-read/MMReadLhs.vue'
import ReadDrawer from './mainmenu-read/MMReadDrawer.vue'

import ModifyLhs from './mainmenu-modify/MMModifyLhs.vue'
import AdminLhs from './mainmenu-admin/MMAdminLhs.vue'
import AuthLhs from './mainmenu-auth/MMAuthLhs.vue'
import AuthDrawer from './mainmenu-auth/MMAuthDrawer.vue'

const { mainMenuType } = storeToRefs(useMenusStore())

let showDrawer = ref<boolean>(false)

const menu = computed(() => {
    switch (mainMenuType.value) {
        case 'Read':
            return { lhs: ReadLhs, rhs: MMLoginOrUser, drawer: ReadDrawer, color: 'primary' }
        case 'Modify':
            return { lhs: ModifyLhs, rhs: null, drawer: null, color: 'orange' }
        case 'Admin':
            return { lhs: AdminLhs, rhs: null, drawer: null, color: 'red' }
        case 'Auth':
            return { lhs: AuthLhs, rhs: null, drawer: AuthDrawer, color: 'primary' }
    }
})
</script>

