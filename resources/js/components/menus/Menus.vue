<template>
  <MainMenu />
  <SubMenu v-if="hasSubMenu"/>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useStatusStore } from '../../scripts/stores/status'
import MainMenu from './MainMenu.vue'
import SubMenu from './SubMenu.vue'

let { hasSubMenu } = storeToRefs(useStatusStore())

</script>

