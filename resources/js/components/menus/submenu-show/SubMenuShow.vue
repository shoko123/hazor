<template>
  <WelcomeButton />
  <FilterButton />
  <CollectionButton />

  <v-spacer />

  <Navigator />

  <v-spacer />

  <Modifiers />
  
  <v-spacer />

  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props">
        <v-icon left dark>mdi-eye</v-icon>
        {{ itemViewText }}
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(item, index) in displayOptions" :key="index" :value="index" @click="setItemViewIndex(index)">
        <v-list-item-title>{{ item }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>

import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useItemStore } from '../../../scripts/stores/item'
import { useModuleStore } from '../../../scripts/stores/module'

import Navigator from './Navigator.vue'
import Modifiers from './modifiers/Modifiers.vue'
import WelcomeButton from '../lhs_buttons/WelcomeButton.vue'
import FilterButton from '../lhs_buttons/FilterButton.vue'
import CollectionButton from '../lhs_buttons/CollectionButton.vue'
const { itemViews } = storeToRefs(useModuleStore())

let is = useItemStore()

const displayOptions = computed(() => {
  return itemViews.value
})

const itemViewText = computed(() => {
  return itemViews.value.length === 0 ? '' : itemViews.value[is.itemViewIndex]
})

function setItemViewIndex(index: number) {
  is.setItemViewIndex(index)
}
</script>
