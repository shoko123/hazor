<template>
  <div>
    <v-btn large rounded slot="activator" @click="openModal">{{ searchText }}</v-btn>
    <v-dialog v-model="dialog" persistent max-width="600">
      <v-card class="elevation-12">
        <v-card-title class="primary white--text">{{ searchText }}</v-card-title>
        <v-card-text>
          <v-text-field label="search text" v-model="searchText" class="mr-1" filled></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="select">Done</v-btn>
          <v-btn @click="reset" primary>Reset</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup >
import { computed, ref, onMounted } from 'vue'
import { useTrioStore } from '../../scripts/stores/trio';

const props = defineProps<{
  paramKey: string
}>()

onMounted(() => {
  console.log(`TextSelectorChip.onMounted props: ${JSON.stringify(props, null, 2)}`)
})

let dialog = ref<boolean>(false)
let trio = useTrioStore()
let searchText = 'jjj'


const param = computed(() => {
  return trio
})



function openModal() {
  dialog.value = false
}

function select() {
  console.log(`select)`)
}
function reset() {
  console.log(`reset)`)
}

</script>

<style scoped></style>
