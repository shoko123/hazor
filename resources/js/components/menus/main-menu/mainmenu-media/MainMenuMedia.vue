<template>
  <v-app-bar-title>
    {{ header }}
    <v-btn v-if="!showUploader" @click="upload" variant="outlined">Upload files</v-btn>
  </v-app-bar-title>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoutesMainStore } from '../../../../scripts/stores/routes/routesMain'
import { useMediaStore } from '../../../../scripts/stores/media'

let { current } = storeToRefs(useRoutesMainStore())

const { showUploader } = storeToRefs(useMediaStore())
const header = computed(() => {
  return `** Dig ** : Media Editor for ${current.value.module} ${current.value.url_id}`
})

function upload() {
  showUploader.value = true
}
</script>

