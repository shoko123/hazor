<template>
  <v-app-bar-title>
    {{ header }}
    <v-btn :disabled="disableShowUploaderButton" @click="showUploader1" variant="outlined">Upload files</v-btn>
    <v-btn @click="back" variant="outlined">Back to Item</v-btn>
  </v-app-bar-title>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoutesMainStore } from '../../../../scripts/stores/routes/routesMain'
import { useMediaStore } from '../../../../scripts/stores/media'
import { useRouter } from 'vue-router'

let { current } = storeToRefs(useRoutesMainStore())

const { showUploader } = storeToRefs(useMediaStore())
const router = useRouter()

const header = computed(() => {
  return `** Dig ** : Media Editor for ${current.value.module} ${current.value.slug}`
})

const disableShowUploaderButton = computed(() => {
  return showUploader.value
})


function showUploader1() {
  showUploader.value = true
}
function back() {
  router.push({ name: 'show', params: { module: current.value.url_module, slug: current.value.slug } })
  showUploader.value = false
}
</script>

