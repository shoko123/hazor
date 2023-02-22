
<template>
  <MediaUploader />
  <v-container fluid>
    <Collection v-bind="{ source: 'media' }">
      <!-- <template v-slot:actions>
        <v-btn slot="activator" label="tag" @click="add()" class="primary--text mr-2">Add media</v-btn>
        <v-dialog v-model="dialogAddMedia" persistent>
          <MediaUploader />
        </v-dialog>
        <v-btn @click="cancel" class="primary--text mr-2">Back to {{ itemType }}</v-btn>
      </template> -->
    </Collection>
  </v-container>


</template>

<script lang="ts" setup >
import Collection from "../collections/Collection.vue";
import MediaUploader from "./MediaUploader.vue"
import { computed, onMounted } from 'vue'


const header = computed(() => {
  return 'header'
})

const dialogAddMedia = computed({
  get: () => { return 6 },
  set: val => {
    console.log(`Collection.page.set to ${val}`)

  }
})


function add() {
  console.log(`add`)
}
function cancel() {
  console.log(`cancel`)
}


</script>