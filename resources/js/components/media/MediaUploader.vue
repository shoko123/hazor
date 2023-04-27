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
                    <v-col v-for="(item, index) in mediaReadable" :key="index" cols="2">
                      <v-img :src="item" height="30vh"></v-img>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-container>
          </v-row>

          <v-row class="pt-2">
            <v-file-input v-model="mediaImages" multiple :show-size="1000" accept="image/png, image/jpeg, image/bmp"
              placeholder="Select images" prepend-icon="mdi-camera" @change="onInputChange" @click:clear="clear()"
              :label="fileInputLabel">
            </v-file-input>
          </v-row>

          <v-row>
            <v-select v-if="mediaReady" label="media collection type" :items="mediaCollections" item-title="label"
              item-value="index" v-model="mediaCollection"></v-select>
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

//notifications
const loadingToBrowser = ref<boolean>(false)

const mediaReady = computed(() => {
  return m.mediaReady
})

const header = computed(() => {
  return "Media Uploader"
})

const fileInputLabel = computed(() => {
  return images.value.length === 0 ? `Add media` : `Selected to upload`
})

//load media to browser

const images = ref<File[]>([])
const imagesAsBrowserReadable = ref<string[]>([])

const mediaReadable = computed(() => {
  return m.imagesAsBrowserReadable
})
const mediaImages = computed({
  get: () => { return m.images },
  set: val => {
    console.log(`mediaImages.set(${val})`)
    m.images = val as unknown as File[]
  }
})
async function onInputChange(media: File[]) {
  m.onInputChange(media) 
  // if (images.value.length > 6) {
  //   alert("Max number of files is 6 - Upload aborted!");
  //   clear()
  //   return
  // }
  // images.value.forEach((file) => {
  //   if (file.size > 1024 * 1024 * 2) {
  //     alert(`File ${file.name} exceeds max allowed 2MB - Upload aborted!`);
  //     clear()
  //     return
  //   }
  // });

  // loadingToBrowser.value = true
  // console.log("Load files - started")
  // await Promise.all(images.value.map(async (image) => { addImage(image) }))
  //   .catch(err => {
  //     console.log(`Error encountered when loading files - clearing files`)
  //     loadingToBrowser.value = false
  //     clear()
  //     return
  //   })
  // loadingToBrowser.value = false
  // console.log("Load files -finished")
}

// async function addImage(file: File) {
//   const reader = new FileReader()
//   reader.onload = (e) => {
//     if (e.target) {
//       console.log(`uploader.push image`)
//       imagesAsBrowserReadable.value.push(<string>e.target.result)
//     }
//   };
//   reader.readAsDataURL(file);
// }

function clear() {
  images.value = []
  imagesAsBrowserReadable.value = []
}

//choose media collection
const mediaCollections = computed(() => {
  return m.getMediaCollectionsNames
})

const mediaCollection = computed({
  get: () => { return m.getMediaCollection },
  set: val => {
    console.log(`mediaCollection.set(${val})`)
    m.setMediaCollection(val as unknown as number)
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
