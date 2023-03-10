<template>

    <v-btn large rounded slot="activator" @click="openModal()" :disabled="disable"
      class="purple white--text no-uppercase">{{ tag }}</v-btn>
    <v-dialog v-model="dialog" persistent max-width="600">
      <v-card class="elevation-12">
        <v-card-title class="primary white--text">Pick a {{ moduleName }}</v-card-title>
        <v-card-text>
          <PickerForm />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="goTo()" :disabled="disableGoTo">Go!</v-btn>
          <v-btn @click="cancel" primary>Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import PickerForm from './PickerForm.vue'
//let { name } = storeToRefs(useModuleStore())
import { useItemStore } from '../../../../../scripts/stores/item'

let i = useItemStore()


const tag = computed(() => {
  return i.derived.module + ' ' + i.derived.url_id
})

const moduleName = computed(() => {
  return false
})

const dialog = computed(() => {
  return false
})
const status = computed(() => {
  return false
})
const isLocus = computed(() => {
  return false
})
const isFind = computed(() => {
  return false
})
const isReady = computed(() => {
  return false
})

const disable = computed(() => {
  return false
})
const disableGoTo = computed(() => {
  return false
})
function openModal() {
  console.log(`openModal`)
}

function goTo() {
  console.log(`goTo`)
}

function cancel() {
  console.log(`cancel`)
}


</script>
<style scoped>
.no-uppercase {
  text-transform: none;
}
</style>
