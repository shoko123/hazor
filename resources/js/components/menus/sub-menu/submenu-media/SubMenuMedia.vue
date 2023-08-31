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
import { useRouter } from 'vue-router'

let { current } = storeToRefs(useRoutesMainStore())
const { showUploader, orderChanged } = storeToRefs(useMediaStore())
const { clear, reorder } = useMediaStore()

const router = useRouter()

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
  router.push({ name: 'show', params: { module: current.value.url_module, slug: current.value.slug } })
  clear()

}
function back() {
  router.push({ name: 'show', params: { module: current.value.url_module, slug: current.value.slug } })
  clear()
}
</script>
