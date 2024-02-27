<template>
  <v-chip-group
    v-model="selectedParamIndexes"
    multiple
    column
    selected-class="primary"
  >
    <v-chip
      v-for="(param, index) in params"
      :key="index"
      color="blue"
      large
      @click="paramClicked(param.key)"
    >
      {{ param.text }}
    </v-chip>
  </v-chip-group>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useTrioStore2 } from '../../scripts/stores/trio/trio2'

let trio = useTrioStore2()

const params = computed(() => {
  return trio.visibleParams
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
  set: val => { val }
})

function paramClicked(prmKey: string) {
    trio.paramClicked(prmKey)
}

</script>


