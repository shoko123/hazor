<template>
  <v-card class="elevation-12">
    <v-card-title id="title" class="grey py-0 mb-4">{{ header }}</v-card-title>
    <v-card-text>

      <div class="mb-2">
        <v-btn color="green" @click="submit">Submit</v-btn>
        <v-btn class="ml-2" color="red" @click="cancel">cancel</v-btn>
        <v-btn class="ml-2" color="blue" @click="resetToItem">Reset To Item</v-btn>
        <v-btn class="ml-2" color="blue" @click="clear">Clear</v-btn>
      </div>
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

      <v-sheet elevation="10" class="mt-2 pa-4">
        <div> {{ groupHeader }}</div>
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
import { useTrioStore } from '../../scripts/stores/trio/trio'
import { useTaggerStore } from '../../scripts/stores/trio/tagger'
import { useRouter } from 'vue-router'

const router = useRouter()
let trio = useTrioStore()
let tagger = useTaggerStore()
const header = computed(() => {
  return 'Item Tags Selector'
})

const groupHeader = computed(() => {
  let group = groups.value[groupIndex.value]
  return `${group.required ? "R": "Not r"}equired,  ${group.multiple ? "multiple": "single"} selection`
})

const cats = computed(() => {
  return trio.visibleCategories()
})

const groups = computed(() => {
  return trio.visibleGroups()
})

const params = computed(() => {
  return trio.visibleParams()
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
  trio.paramClicked('New', trio.groupIndex, paramIndex)
}

async function submit() {
  await tagger.sync()
  trio.resetCategoryAndGroupIndices()
  tagger.clearSelectedNewItemParams 
  router.go(-1) 
}
function cancel(paramIndex: number) {
  console.log(`cancelClicked`)
  trio.resetCategoryAndGroupIndices()
  tagger.clearSelectedNewItemParams
  router.go(-1)
}

function resetToItem() {
  console.log(`resetToItem`)  
  trio.resetCategoryAndGroupIndices()
  tagger.copyCurrentToNew()  
}

function clear() {
  console.log(`clear`)
  trio.resetCategoryAndGroupIndices()
  tagger.clearSelectedNewItemParams()
}

function resetIndices() {
  trio.categoryIndex = 0
  trio.groupIndex = 0
}
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


