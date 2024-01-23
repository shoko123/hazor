<template>
  <v-container>
    <v-row no-gutters>
      <v-col
        cols="12"
        sm="3"
      >
        <v-card
          class="mx-auto"
          variant="outlined"
        >
          <v-card-item>
            <v-text-field
              v-model="search1"
              label="search term1"
              name="search1"
              filled
            />
            OR
            <v-text-field
              v-model="search2"
              label="search term2"
              name="search2"
              filled
            />
            OR
            <v-text-field
              v-model="search3"
              label="search term3"
              name="search3" 
              filled
            />
          </v-card-item>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="1"
      >
        <v-row
          justify="center"
          no-gutters
        >
          OR
        </v-row>
      </v-col>
      <v-col
        cols="12"
        sm="3"
        class="ml-2"
      >
        <v-card
          class="mx-auto"
          variant="outlined"
        >
          <v-card-item>
            <v-text-field
              v-model="search4"
              label="search term4"
              name="search4"
              filled
            />
            OR
            <v-text-field
              v-model="search5"
              label="search term5"
              name="search5"
              filled
            />
            OR
            <v-text-field
              v-model="search6"
              label="search term6"
              name="search6"
              filled
            />
          </v-card-item>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="2"
      >
        <v-btn
          class="ml-2"
          @click="clearClicked"
        >
          Clear
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useTrioStore } from '../../scripts/stores/trio/trio'
import { useFilterStore } from '../../scripts/stores/trio/filter'

let filter = useFilterStore()
let trio = useTrioStore()
let searchText = ref<string>("")

const params = computed(() => {
  //console.log(`TextSearch.params: ${JSON.stringify(trio.visibleParams.value, null, 2)}`)
  return trio.visibleParams
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



