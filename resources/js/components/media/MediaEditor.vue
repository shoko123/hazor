
<template>
  <MediaUploader />
  <v-container fluid class="pa-1">
    <Collection v-bind="{ source: 'media' }"> </Collection>
  </v-container>
</template>

<script lang="ts" setup >
import Collection from "../collections/Collection.vue";
import MediaUploader from "./MediaUploader.vue"
import { computed, onMounted } from 'vue'


</script>