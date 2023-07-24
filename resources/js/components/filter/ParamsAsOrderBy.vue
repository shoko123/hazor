<template>
  <v-chip-group multiple column v-model="selectedParamIndexes" selected-class="primary">
    <v-chip v-for="(param, index) in params" :key="index" @click="paramClicked(index)" color="blue" large>
      {{ param.name }}
    </v-chip>
  </v-chip-group>
</template>

<script lang="ts" setup >
import { computed, ref } from 'vue'
import { useTrioStore } from '../../scripts/stores/trio/trio'

let trio = useTrioStore()

const params = computed(() => {
  return trio.visibleParams()
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
    trio.paramClicked(trio.groupIndex, paramIndex)
}

</script>


