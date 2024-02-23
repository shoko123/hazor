<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12" sm="8">
        <v-card class="mx-auto" variant="outlined">
          <v-card-item>
            <v-text-field v-for="(item, index) in textSearchValues" :key="index" v-model="textSearchValues[index]"
              @update:modelValue='(val) => searchTextChanged(index, val)' :label="`term-${index + 1}`"
              :name="`search-${index + 1}`" filled>
            </v-text-field>
          </v-card-item>
        </v-card>
      </v-col>
      <v-col cols="12" sm="2">
        <v-btn class="ml-2" @click="searchTextClearCurrent">
          Clear
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useFilterStore } from '../../scripts/stores/trio/filter'
import { useTrioStore2 } from '../../scripts/stores/trio/trio2'
const { searchTextChanged, searchTextClearCurrent } = useFilterStore()
const { textSearchValues } = storeToRefs(useTrioStore2())

</script>



