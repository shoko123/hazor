<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12" sm="3">
        <v-card class="mx-auto" variant="outlined">
          <v-card-item>
            <v-text-field label="search term1" v-model="search1" name="search1" filled>
            </v-text-field>
            OR
            <v-text-field label="search term2" v-model="search2"  name="search2"
              filled></v-text-field>
            OR
            <v-text-field label="search term3" v-model="search3" name="search3" 
              filled></v-text-field>
          </v-card-item>
        </v-card>
      </v-col>
      <v-col cols="12" sm="1">
        <v-row justify="center" no-gutters>
          AND</v-row>
      </v-col>
      <v-col cols="12" sm="3" class="ml-2">
        <v-card class="mx-auto" variant="outlined">
          <v-card-item>
            <v-text-field label="search term4" v-model="search4" name="search3" filled>
            </v-text-field>
            OR
            <v-text-field label="search term5" v-model="search5" name="search4"
              filled></v-text-field>
            OR
            <v-text-field label="search term6" v-model="search6" name="search5"
              filled></v-text-field>
          </v-card-item>
        </v-card>
      </v-col>
      <v-col cols="12" sm="2">
        <v-btn @click="clearClicked">Clear</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup >
import { computed, ref } from 'vue'
import { useTrioStore } from '../../scripts/stores/trio/trio'
import { useFilterStore } from '../../scripts/stores/trio/filter'

let filter = useFilterStore()
let trio = useTrioStore()
let searchText = ref<string>("")

const params = computed(() => {
  //console.log(`TextSearch.params: ${JSON.stringify(trio.visibleParams('Filter'), null, 2)}`)
  return trio.visibleParams('Filter')
})

const search1 = computed({
  get: () => {
    return params.value[0].name
  },
  set: val => {
    let currentIsEmpty = params.value[0].name === ""
    let newIsEmpty = val === ""
    searchText.value = val
    trio.setFilterSearchTerm(params.value[0].paramKey, searchText.value)

    if (currentIsEmpty && !newIsEmpty) {
      filter.addRemoveSearchParam(params.value[0].paramKey)
    }
    if (!currentIsEmpty && newIsEmpty) {
      filter.addRemoveSearchParam(params.value[0].paramKey)
    }
  }

})

const search2 = computed({
  get: () => {
    return params.value[1].name
  },
  set: val => {
    let currentIsEmpty = params.value[1].name === ""
    let newIsEmpty = val === ""
    searchText.value = val
    trio.setFilterSearchTerm(params.value[1].paramKey, searchText.value)

    if (currentIsEmpty && !newIsEmpty) {
      filter.addRemoveSearchParam(params.value[1].paramKey)
    }
    if (!currentIsEmpty && newIsEmpty) {
      filter.addRemoveSearchParam(params.value[1].paramKey)
    }
  }

})
const search3 = computed({
  get: () => {
    return params.value[2].name
  },
  set: val => {
    let currentIsEmpty = params.value[2].name === ""
    let newIsEmpty = val === ""
    searchText.value = val
    trio.setFilterSearchTerm(params.value[2].paramKey, searchText.value)

    if (currentIsEmpty && !newIsEmpty) {
      filter.addRemoveSearchParam(params.value[2].paramKey)
    }
    if (!currentIsEmpty && newIsEmpty) {
      filter.addRemoveSearchParam(params.value[2].paramKey)
    }
  }

})
const search4 = computed({
  get: () => {
    return params.value[3].name
  },
  set: val => {
    let currentIsEmpty = params.value[3].name === ""
    let newIsEmpty = val === ""
    searchText.value = val
    trio.setFilterSearchTerm(params.value[3].paramKey, searchText.value)

    if (currentIsEmpty && !newIsEmpty) {
      filter.addRemoveSearchParam(params.value[3].paramKey)
    }
    if (!currentIsEmpty && newIsEmpty) {
      filter.addRemoveSearchParam(params.value[3].paramKey)
    }
  }

})

const search5 = computed({
  get: () => {
    return params.value[4].name
  },
  set: val => {
    let currentIsEmpty = params.value[4].name === ""
    let newIsEmpty = val === ""
    searchText.value = val
    trio.setFilterSearchTerm(params.value[4].paramKey, searchText.value)

    if (currentIsEmpty && !newIsEmpty) {
      filter.addRemoveSearchParam(params.value[4].paramKey)
    }
    if (!currentIsEmpty && newIsEmpty) {
      filter.addRemoveSearchParam(params.value[4].paramKey)
    }
  }

})
const search6 = computed({
  get: () => {
    return params.value[5].name
  },
  set: val => {
    let currentIsEmpty = params.value[5].name === ""
    let newIsEmpty = val === ""
    searchText.value = val
    trio.setFilterSearchTerm(params.value[5].paramKey, searchText.value)

    if (currentIsEmpty && !newIsEmpty) {
      filter.addRemoveSearchParam(params.value[5].paramKey)
    }
    if (!currentIsEmpty && newIsEmpty) {
      filter.addRemoveSearchParam(params.value[5].paramKey)
    }
  }

})

function clearClicked() {
  search1.value = ""
  search2.value = ""
  search3.value = ""
  search4.value = ""
  search5.value = ""
  search6.value = ""  
}

</script>



