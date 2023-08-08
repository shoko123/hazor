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
            <v-menu v-if="mediaReady">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props">
                  Type: {{ mediaCollection }}
                </v-btn>
              </template>
              <v-list>
                <v-list-item v-for="(item, index) in mediaCollectionNames" :key="index" :value="index"
                  @click="setMediaCollectionName(item)">
                  <v-list-item-title>{{ item }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-btn v-if="mediaReady" @click="upload" class="ml-2">Upload</v-btn>
            <v-btn v-if="mediaReady" @click="openMultiItemSelector" class="ml-2">Upload as multi item media</v-btn>
            <v-btn @click="cancel" class="ml-2">Cancel</v-btn>
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
const mediaCollectionNames = computed<string[]>(() => {
  return m.mediaCollectionNames
})

const mediaCollection = computed(() => {
  return m.mediaCollectionName
})

function setMediaCollectionName(val: string) {
  m.mediaCollectionName = val
}

function openMultiItemSelector() {

}

async function upload() {
  await m.upload()
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
