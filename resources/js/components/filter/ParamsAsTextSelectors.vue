<template>
  <v-chip-group multiple column v-model="selectedParamIndexes" selected-class="primary">
    <v-chip v-for="(param, index) in params" :key="index" @click="paramClicked(index)" color="blue" large>
      {{ param.name }}
    </v-chip>
    <v-dialog v-model=dialog persistent width="auto">
      <v-card>
        <v-card-text>
          Please enter search term
          <v-text-field label="search term" v-model="searchText" filled></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-row wrap>
            <v-btn class="ml-4" color="primary" @click="activate(true)">Activate</v-btn>
            <v-btn color="primary" @click="activate(false)">Deactivate</v-btn>
            <v-btn color="primary" @click="activate(false, true)">Clear & deactivate</v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-chip-group>
</template>

<script lang="ts" setup >
import { computed, ref } from 'vue'
import { useTrioStore } from '../../scripts/stores/trio'

let trio = useTrioStore()
let searchText = ref<string>("")
let dialog = ref<boolean>(false)
let dialogIndex = ref<number>(0)


const params = computed(() => {
  return trio.visibleParams('Filter')
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


function paramClicked(paramIndex: number) {
  console.log(`textSearchChip.clicked(${paramIndex})`)
  //trio.paramClicked('Filter', trio.groupIndex, index)  
  dialog.value = true
  dialogIndex.value = paramIndex
  searchText.value = params.value[dialogIndex.value].name === '[empty]' ? '' : params.value[dialogIndex.value].name
}

function activate(activate: boolean, clear = false) {
  console.log(`activate.clicked(${dialogIndex.value})`)

  let paramKey = params.value[dialogIndex.value].paramKey
  let isActivated = trio.selectedFilterParams.some(x => x === paramKey)

  trio.setFilterSearchTerm(params.value[dialogIndex.value].paramKey, clear ? '[empty]' : ((searchText.value === '') ? '[empty]': searchText.value))

  if(clear) {searchText.value = ""}

  if(activate && searchText.value === "") {
    dialog.value = false
    return
  }
  if ((activate && !isActivated) || (!activate && isActivated)) {
    trio.paramClicked('Filter', trio.groupIndex, dialogIndex.value)
  }
  dialog.value = false
}

</script>



