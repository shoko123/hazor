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
import { useItemStore } from '../../../../scripts/stores/item'

import Navigator from './Navigator.vue'
import Modifiers from './modifiers/Modifiers.vue'
import WelcomeButton from '../lhs-buttons/WelcomeButton.vue'
import FilterButton from '../lhs-buttons/FilterButton.vue'
import CollectionButton from '../lhs-buttons/CollectionButton.vue'


let is = useItemStore()

const displayOptions = computed(() => {
  return is.itemViews
})

const itemViewText = computed(() => {
  return is.itemViews.length === 0 ? '' : is.itemView
})

function setItemViewIndex(index: number) {
  is.setItemViewIndex(index)
}
</script>
