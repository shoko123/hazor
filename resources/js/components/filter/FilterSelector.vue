<template>
  <v-card class="elevation-12">
    <v-card-title id="title" class="grey py-0 mb-4">{{ header }}</v-card-title>
    <v-card-text>
      <v-tabs v-model="categoryIndex" class="primary">
        <v-tab v-for="(cat, index) in cats" :key="index" color="purple"
          :class="cat.selectedCount > 0 ? 'has-selected' : ''">
          {{ cat.selectedCount === 0 ? cat.name : `${cat.name}(${cat.selectedCount})` }}
        </v-tab>
      </v-tabs>

      <v-tabs v-model="groupIndex">
        <v-tab v-for="(group, index) in groups" :key="index" color="purple"
          :class="[group.selectedCount > 0 ? 'has-selected' : '', 'text-capitalize']">
          {{ group.selectedCount === 0 ? group.name : `${group.name}(${group.selectedCount})` }}
        </v-tab>
      </v-tabs>

      <v-sheet elevation="10" class="ma-2">
        <div v-if="isColumnSearchGroup">
          <ParamsAsTextSelectors/>
        </div>
        <div v-else>
          <ParamsAsChips/>
        </div>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup >
import { computed, ref } from 'vue'
import { useTrioStore } from '../../scripts/stores/trio/trio'
import ParamsAsChips from './ParamsAsChips.vue'
import ParamsAsTextSelectors from './ParamsAsTextSelectors.vue'
let trio = useTrioStore()
let searchText = ref<string>("")
let modal = ref<boolean[]>([false, false, false])
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

const selectedParamIndexes = computed({
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

const isColumnSearchGroup = computed(() => {
  if(groups.value.length === 0) return false
  return groups.value[groupIndex.value].isTextSearch
})


</script>
<style scoped>
.has-selected {
  background-color: rgb(212, 235, 244);
  margin: 2px;
}

#title {
  background-color: grey;
}
</style>


