<template>
  <MainMenu />
  <SubMenu v-if="hasSubMenu"/>
</template>

<script lang="ts" setup>
import { defineComponent, computed } from 'vue'
import MainMenu from './MainMenu.vue'
import SubMenu from './SubMenu.vue'
import { storeToRefs } from 'pinia'
import { useStatusStore } from '../../scripts/stores/status'


let { hasSubMenu } = storeToRefs(useStatusStore())

</script>

