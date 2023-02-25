
<template>
  <MediaUploader v-if="showUploader" />
  <v-container fluid class="pa-1">
    <Collection v-bind="{ source: 'media' }"> </Collection>
  </v-container>
</template>

<script lang="ts" setup >
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import Collection from "../collections/Collection.vue"
import { useMediaStore } from '../../scripts/stores/media'
import MediaUploader from "./MediaUploader.vue"

let { showUploader } = storeToRefs(useMediaStore())


</script>