<template>
  <v-btn :disabled="disableShowUploaderButton" @click="showUpldr" variant="outlined">Upload files</v-btn>
  <v-btn @click="back" variant="outlined">{{ backText }}</v-btn>
  <v-btn v-if="orderChanged" @click="reorderAndBack" variant="outlined">Save Order & back</v-btn>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoutesMainStore } from '../../../../scripts/stores/routes/routesMain'
import { useMediaStore } from '../../../../scripts/stores/media'
import { useItemStore } from '../../../../scripts/stores/item'

const { routerPush } = useRoutesMainStore()
const { derived } = storeToRefs(useItemStore())
const { showUploader, orderChanged } = storeToRefs(useMediaStore())
const { clear, reorder } = useMediaStore()

const disableShowUploaderButton = computed(() => {
  return showUploader.value
})

const backText = computed(() => {
  return orderChanged.value ? "Back without saving order" : "back"
})

function showUpldr() {
  showUploader.value = true
}

async function reorderAndBack() {
  console.log("Reorder")
  await reorder()
  clear()
  routerPush('show', <string>derived.value.slug) 
}
function back() {
  clear()
  routerPush('show', <string>derived.value.slug)   
}
</script>
