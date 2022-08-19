<template>
  <MainMenu />
  <SubMenu v-if="subMenu"/>
</template>

<script lang="ts" setup>
import { defineComponent, computed } from 'vue'
import MainMenu from './MainMenu.vue'
import SubMenu from './SubMenu.vue'
import { storeToRefs } from 'pinia'
import { useStatusStore } from '../../scripts/stores/status'


let { subMenu } = storeToRefs(useStatusStore())

</script>

