<template>
  <v-card class="elevation-12">
    <v-card-title id="title" class="grey py-0 mb-4">{{ header }}</v-card-title>
    <v-card-text>
      <v-tabs v-model="categoryIndex" class="primary">
        <v-tab v-for="(cat, index) in cats" :key="index" color="purple"
          :class="cat.selectedCount > 0 ? 'has-selected': ''">
          {{ cat.selectedCount === 0 ? cat.name : `${cat.name}(${cat.selectedCount})` }}
        </v-tab>
      </v-tabs>

      <v-tabs v-model="groupIndex">
        <v-tab v-for="(group, index) in groups" :key="index"  color="purple"
          :class="[group.selectedCount > 0 ? 'has-selected': '', 'no-uppercase']">
          {{ group.selectedCount === 0 ? group.name : `${group.name}(${group.selectedCount})` }}
        </v-tab>
      </v-tabs>

      <v-sheet elevation="10" class="pa-4">
        <v-chip-group multiple column v-model="selected" active-class="primary">
          <v-chip v-for="(param, index) in params" :key="index" @click="paramClicked(index)" color="blue" large>
            {{ param.name }}</v-chip>
        </v-chip-group>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup >
import { computed, ref } from 'vue'
import { useTrioStore } from '../../scripts/stores/trio';

let trio = useTrioStore()

const header = computed(() => {
  return 'Filter Selector'
})

const cats = computed(() => {
  return trio.visibleCategories('Filter')
})

const groups = computed(() => {
  return trio.visibleGroups('Filter')
})

const params = computed(() => {
  return trio.visibleParams('Filter')
})

const categoryIndex = computed({
  get: () => { return trio.categoryIndex },
  set: val => {
    console.log(`categoryIndex set to ${val}`)
    trio.groupIndex = 0
    trio.categoryIndex = val
  }
})

const groupIndex = computed({
  get: () => { return trio.groupIndex },
  set: val => {
    console.log(`groupIndex set to ${val}`)
    trio.groupIndex = val
  }
})

const selected = computed({
  get: () => {
    let selected: number[] = []
    params.value.forEach((x, index) => {
      if (x.selected === true) {
        selected.push(index)
      }
    })
    return selected
  },
  set: val => { }
})

function paramClicked(paramIndex: number) {
  trio.paramClicked('Filter', trio.groupIndex, paramIndex)
}


</script>
<style scoped>
.no-uppercase {
  text-transform: none !important;
}

.has-selected {
  background-color: rgb(212, 235, 244);
  margin: 2px;
}

#title {
  background-color: grey;
}
</style>


