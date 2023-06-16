<template>
  <v-container fluid class="pa-1">
    <v-card class="elevation-12">
      <v-toolbar id="title" density="compact" :height="50">
        <v-toolbar-title> {{ header }}</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-container fluid class="pa-1">
          <v-row v-if="mediaReady">
            <v-container fluid class="pa-1">
              <v-card class="elevation-12">
                <v-card-title>Upload Preview</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col v-for="(item, index) in imagesAsBrowserReadable" :key="index" cols="2">
                      <v-img :src="item" height="30vh"></v-img>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-container>
          </v-row>

          <v-row class="pt-2">
            <v-file-input v-model="images" multiple :show-size="1000" accept="image/png, image/jpeg, image/bmp"
              placeholder="Select images" prepend-icon="mdi-camera" @change="onInputChange" @click:clear="clear()"
              :label="fileInputLabel">
            </v-file-input>
          </v-row>

          <v-row>
            <v-select v-if="mediaReady" label="media collection type" :items="mediaCollections"
              v-model="mediaCollection"></v-select>
          </v-row>

          <v-row class="d-flex justify-left align-baseline pt-2" style="gap: 1rem">
            <v-btn :disabled="!mediaReady" @click="upload">Upload</v-btn>
            <v-btn :disabled="!mediaReady" @click="openMultiItemSelector">Upload as multi item media</v-btn>
            <v-btn @click="cancel">Cancel</v-btn>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useMediaStore } from '../../scripts/stores/media'

const m = useMediaStore()

const mediaReady = computed(() => {
  return m.mediaReady
})

const header = computed(() => {
  return "Media Uploader"
})

const fileInputLabel = computed(() => {
  return m.images.length === 0 ? `Add media` : `Selected to upload`
})

//load media to browser
const images = computed({
  get: () => { return m.images },
  set: val => {
    m.images = <File[]>val
  }
})

const imagesAsBrowserReadable = computed(() => {
  return m.imagesAsBrowserReadable
})

async function onInputChange(media: File[]) {
  m.onInputChange(media)
}

function clear() {
  m.clear()
}

//choose media collection
const mediaCollections = computed<string[]>(() => {
  return m.mediaCollectionNames
})

const mediaCollection = computed({
  get: () => { return mediaCollections.value[m.mediaCollectionIndex] },
  set: val => {
    m.mediaCollectionIndex = mediaCollections.value.indexOf(val)
  }
})

async function upload() {
  await m.upload()
}

function openMultiItemSelector() {

}

function cancel() {
  clear()
  m.showUploader = false
}
</script>

<style scoped>
#title {
  background-color: grey;
}
</style>
