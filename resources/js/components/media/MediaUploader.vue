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
                      <v-img :src="images.length === 0 ? 'https://picsum.photos/id/11/500/300' : item"
                        lazy-src="https://picsum.photos/id/11/10/6" height="30vh"></v-img>
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

            <v-select v-if="mediaReady" label="media collection type" :items="mediaCollections" item-title="label"
              item-value="index" v-model="mediaCollection"></v-select>

          </v-row>

          <v-row class="d-flex justify-left align-baseline pt-2" style="gap: 1rem">
            <v-btn :diable="!mediaReady" @click="upload">Upload</v-btn>
            <v-btn :disable="!mediaReady" @click="openMultiItemSelector">Upload as multi item media</v-btn>
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
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import { useXhrStore } from '../../scripts/stores/xhr'
const m = useMediaStore()

//notifications
const loadingToBrowser = ref<boolean>(false)
const loadingToServer = ref<boolean>(false)

const mediaReady = computed(() => {
  return notEmpty.value && !loadingToBrowser.value
})

const header = computed(() => {
  return "Media Uploader"
})

const fileInputLabel = computed(() => {
  return images.value.length === 0 ? `Add media` : `Selected to upload`
})

const notEmpty = computed(() => {
  return images.value.length !== 0
})


//load media to browser

const images = ref<File[]>([])
const imagesAsBrowserReadable = ref<string[]>([])


async function onInputChange(media: File[]) {
  console.log(`onInputChange() files:\n ${JSON.stringify(media, null, 2)}`)

  if (images.value.length > 6) {
    alert("Max number of files is 6 - Upload aborted!");
    clear()
    return
  }
  images.value.forEach((file) => {
    if (file.size > 1024 * 1024 * 2) {
      alert(
        `Size of file ${file.name} exceeds max allowed of 2MB - Upload aborted!`
      );
      clear()
      return
    }
  });

  loadingToBrowser.value = true
  console.log("Load files - started")
  await Promise.all(images.value.map(async (image) => { addImage(image) })).catch(err => {
    console.log(`Error encountered when loading files - clearing files`)
    loadingToBrowser.value = false
    clear()
    return
  })
  loadingToBrowser.value = false
  console.log("Load files -finished")
}

async function addImage(file: File) {

  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target) {
      imagesAsBrowserReadable.value.push(<string>e.target.result)
    }
  };
  //console.log(`addImage() file:\n ${JSON.stringify(file, null, 2)}`)
  reader.readAsDataURL(file);
}

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
  const r = useRoutesMainStore()

  const { send } = useXhrStore()
  let fd = new FormData();

  images.value.forEach((file) => {
    fd.append("media_files[]", file, file.name);
  });

  fd.append("model", r.current.module);
  fd.append("id", <string>r.current.url_id);
  fd.append("media_collection_name", 'photos');

  console.log(`upload() formData:\n ${JSON.stringify(fd, null, 2)}`)
  await send("media/upload", 'post', fd).catch((err) => {
    console.log(`mediaUpload failed! err:\n ${JSON.stringify(err, null, 2)}`)
  })
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
