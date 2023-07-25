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
      <v-tabs v-model="catIndex" class="primary">
        <v-tab v-for="(cat, index) in visibleCategories" :key="index" color="purple"
          :class="cat.selectedCount > 0 ? 'has-selected' : ''">
          {{ cat.selectedCount === 0 ? cat.name : `${cat.name}(${cat.selectedCount})` }}
        </v-tab>
      </v-tabs>

      <v-tabs v-model="grpIndex">
        <v-tab v-for="(group, index) in visibleGroups" :key="index" color="purple"
          :class="[group.selectedCount > 0 ? 'has-selected' : '', 'text-capitalize']">
          {{ group.selectedCount === 0 ? group.name : `${group.name}(${group.selectedCount})` }}
        </v-tab>
      </v-tabs>

      <v-sheet elevation="10" class="mt-2 pa-4">
        <div> {{ groupHeader }}</div>
        <v-chip-group multiple column v-model="selectedParams" active-class="primary">
          <v-chip v-for="(param, index) in visibleParams" :key="index" @click="pClicked(index)" color="blue" large>
            {{ param.name }}</v-chip>
        </v-chip-group>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup >
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTrioStore } from '../../scripts/stores/trio/trio'
import { useTaggerStore } from '../../scripts/stores/trio/tagger'
import { useRouter } from 'vue-router'

const router = useRouter()
let { visibleCategories, visibleGroups, visibleParams, categoryIndex, groupIndex } = storeToRefs(useTrioStore())
let { resetCategoryAndGroupIndices, paramClicked } = useTrioStore()
let { sync, clearSelectedNewItemParams, copyCurrentToNew } = useTaggerStore()

const header = computed(() => {
  return 'Item Tags Selector'
})

const groupHeader = computed(() => {
  let group = visibleGroups.value[grpIndex.value]
  return `${group.required ? "R" : "Not r"}equired,  ${group.multiple ? "multiple" : "single"} selection`
})

const catIndex = computed({
  get: () => { return categoryIndex.value },
  set: val => {
    console.log(`categoryIndex set to ${val}`)
    groupIndex.value = 0
    categoryIndex.value = val
  }
})

const grpIndex = computed({
  get: () => { return groupIndex.value },
  set: val => {
    console.log(`groupIndex set to ${val}`)
    groupIndex.value = val
  }
})

const selectedParams = computed({
  get: () => {
    let selected: number[] = []
    visibleParams.value.forEach((x, index) => {
      if (x.selected === true) {
        selected.push(index)
      }
    })
    return selected
  },
  set: val => { }
})

function pClicked(paramIndex: number) {
  paramClicked(grpIndex.value, paramIndex)
}

async function submit() {
  await sync().catch(err => {
    console.log(`***** Sync failed *****`)
  })
  resetCategoryAndGroupIndices()
  clearSelectedNewItemParams
  router.go(-1)
}

function cancel(paramIndex: number) {
  console.log(`cancelClicked`)
  resetCategoryAndGroupIndices()
  clearSelectedNewItemParams()
  router.go(-1)
}

function resetToItem() {
  console.log(`resetToItem`)
  resetCategoryAndGroupIndices()
  copyCurrentToNew()
}

function clear() {
  console.log(`clear`)
  resetCategoryAndGroupIndices()
  clearSelectedNewItemParams()
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
