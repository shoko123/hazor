<template>
  <v-card class="elevation-12">
    <v-card-title id="title" class="grey py-0 mb-4">{{ header }}</v-card-title>
    <v-card-text>
      <v-tabs v-model="categoryIndex" class="primary">
        <v-tab v-for="(cat, index) in trio.currentCategories" :key="index">{{ cat.name }}</v-tab>
      </v-tabs>

      <v-tabs v-model="groupIndex" class="primary">
        <v-tab v-for="(tab, index) in trio.currentGroups" :key="index">{{ tab.name }}</v-tab>
      </v-tabs>

      <v-sheet elevation="10" class="pa-4">
        <v-chip-group multiple column active-class="purple">
          <v-chip v-for="(param, index) in trio.currentParams" :key="index" @click="toggleParam(index)"
            color="blue" large>{{ param.name }}</v-chip>
        </v-chip-group>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup >
import { computed } from 'vue'
import { useTrioStore } from '../../scripts/stores/trio';

let trio = useTrioStore()

const header = computed(() => {
  return 'Tag Selector'
})

const categoryIndex = computed({
  get: () => { return trio.selectedCategoryIndex },
  set: val => {
    console.log(`categoryIndex set to ${val}`)
    trio.selectedGroupIndex = 0
    trio.selectedCategoryIndex = val
  }
})

const groupIndex = computed({
  get: () => { return trio.selectedGroupIndex },
  set: val => {
    console.log(`groupIndex set to ${val}`)
    trio.selectedGroupIndex = val
  }
})

function toggleParam(paramIndex: number) {
  console.log(`Param(${paramIndex}) clicked`)
  //this.$store.dispatch(`aux/toggleOneParam`, { key: key, isFilter: true });
}


</script>
<style scoped>
.no-uppercase {
  text-transform: none !important;
}

#title {
  background-color: grey;
}

</style>


