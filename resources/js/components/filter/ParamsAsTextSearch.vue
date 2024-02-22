<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12" sm="8">
        <v-card class="mx-auto" variant="outlined">
          <v-card-item>
            <v-text-field v-for="(item, index) in textSearchValues" :key="index" v-model="textSearchValues[index]"
              @update:modelValue='(val) => changeOccured(index, val)' :label="`${searchGroupLabel} term-${index + 1}`"
              :name="`search-${index + 1}`" filled>
            </v-text-field>
          </v-card-item>
        </v-card>
      </v-col>
      <v-col cols="12" sm="2">
        <v-btn class="ml-2" @click="clearClicked">
          Clear
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTrioStore2 } from '../../scripts/stores/trio/trio2'
import { useFilterStore } from '../../scripts/stores/trio/filter'


const { selectedFilterParams2 } = storeToRefs(useFilterStore())
const { trio, groupIndex, visibleGroups } = storeToRefs(useTrioStore2())


const textSearchParamKeys = computed(() => {
  //console.log(`TextSearch.params: ${JSON.stringify(trio.visibleParams.value, null, 2)}`)
  return visibleGroups.value[groupIndex.value].params
})

const searchGroupLabel = computed(() => {
  return visibleGroups.value[groupIndex.value].name
})

const textSearchValues = computed(() => {
  let vals: string[] = []
  textSearchParamKeys.value.forEach(x => {
    vals.push(trio.value.paramsObj[x].text)
  })
  return vals
})

function changeOccured(index: number, val: any) {
  const paramKey = textSearchParamKeys.value[index]
  console.log(`changeOccured() index: ${index} setting param with key ${paramKey} to: ${val}`)
  trio.value.paramsObj[paramKey].text = val

  //add/remove from selected filters
  const inSelected = selectedFilterParams2.value.includes(paramKey)
  if (inSelected && val === '') {
    const i = selectedFilterParams2.value.indexOf(paramKey)
    selectedFilterParams2.value.splice(i, 1)
  }
  if (!inSelected && val !== '') {
    selectedFilterParams2.value.push(paramKey)
  }
}

function clearClicked() {
  console.log(`clear()`)
  textSearchParamKeys.value.forEach(x => {
    trio.value.paramsObj[x].text = ''

    //if currently in selectedFilters, then remove.
    if (selectedFilterParams2.value.includes(x)) {
      const i = selectedFilterParams2.value.indexOf(x)
      selectedFilterParams2.value.splice(i, 1)
    }
  })
}

</script>



