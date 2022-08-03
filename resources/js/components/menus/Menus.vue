<template>
  <MainMenu />
  <SubMenu v-if="subMenu"/>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue"
import MainMenu from './MainMenu.vue'
import SubMenu from './SubMenu.vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '../../scripts/stores/main'

defineComponent({
  name: "Menus",
  components: {
    MainMenu,
    SubMenu
  }
})

let { subMenu } = storeToRefs(useMainStore())

</script>

