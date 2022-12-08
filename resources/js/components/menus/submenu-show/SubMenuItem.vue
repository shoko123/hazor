<template>
  <v-toolbar dense>
     
     <CollectionButtons />
    <Navigator />
    <!--Editor /> -->

    <v-spacer></v-spacer> 

    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props">
          <v-icon left dark>mdi-eye</v-icon>
          {{ itemViewText }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="(item, index) in displayOptions" :key="index" :value="index"
          @click="setItemViewIndex(index)">
          <v-list-item-title>{{ item }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>



  </v-toolbar>
</template>

<script lang="ts" setup>

import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { storeToRefs } from 'pinia'
import { useItemStore } from '../../../scripts/stores/item'
import { useModuleStore } from '../../../scripts/stores/module'
import { useRoutesMainStore } from '../../../scripts/stores/routes/routesMain'

import Navigator from './Navigator.vue'
import Editor from './Editor.vue'
import CollectionButtons from './collection-buttons/CollectionButtons.vue'

const { itemViews } = storeToRefs(useModuleStore())

let is = useItemStore()

const displayOptions = computed(() => {
  return itemViews.value
})

const itemViewIndex = computed(() => {
  return is.itemViewIndex
})


const itemViewText = computed(() => {
  return itemViews.value.length === 0 ? '' : itemViews.value[itemViewIndex.value]
})

function setItemViewIndex(index: number) {
  is.itemViewIndex = index
}


</script>
<style scoped>
.no-uppercase {
  text-transform: none;
}
</style>