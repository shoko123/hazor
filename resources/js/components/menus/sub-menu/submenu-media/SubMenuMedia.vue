<template>
    <v-btn :disabled="disableShowUploaderButton" @click="showUp" variant="outlined">Upload files</v-btn>
    <v-btn @click="back" variant="outlined">Go Back</v-btn>
    <v-btn  @click="reorderBackend" variant="outlined">Save Order</v-btn>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoutesMainStore } from '../../../../scripts/stores/routes/routesMain'
import { useMediaStore } from '../../../../scripts/stores/media'
import { useRouter } from 'vue-router'

let { current } = storeToRefs(useRoutesMainStore())

const { showUploader } = storeToRefs(useMediaStore())
const { clear, reorder } = useMediaStore()
const router = useRouter()



const disableShowUploaderButton = computed(() => {
  return showUploader.value
})


function showUp() {
  showUploader.value = true
}

function reorderBackend() {
  console.log("Reorder")
  reorder()
}
function back() {
  clear()
  router.push({ name: 'show', params: { module: current.value.url_module, slug: current.value.slug } })
  showUploader.value = false
}
</script>
