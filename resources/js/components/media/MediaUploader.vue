<template>
  <v-card height="50vh">
    <v-card-text>
      <v-img :src="images.length === 0 ? 'https://picsum.photos/id/11/500/300' : imagesPreview[0]"
        lazy-src="https://picsum.photos/id/11/10/6" height="30vh"></v-img>
      <v-file-input v-model="images" multiple accept="image/png, image/jpeg, image/bmp" placeholder="Select images"
        prepend-icon="mdi-camera" @change="onInputChange" @click:clear="clear()" label="Image"></v-file-input>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const images = ref<File[]>([])
const imagesPreview = ref<string[]>([])

async function onInputChange(e: File[]) {
  console.log("OnInputChange");
  if (images.value.length > 6) {
    alert("Max number of files is 6 - Upload aborted!");
    //TODO truncate to 6
    clear();
    return;
  }
  images.value.forEach((file) => {
    if (file.size > 1024 * 1024 * 2) {
      alert(
        `Size of file ${file.name} exceeds max allowed of 2MB - Upload aborted!`
      );
      clear();
      return;
    }
  });
  //images.value.forEach((file) =>  addImage(file));
  await Promise.all(images.value.map(async (image) => { addImage(image) }))
}

function clear() {
  images.value = []
  imagesPreview.value = [];
  //media_type.value = { text: "Photo(s)", value: "photo" }
}

async function addImage(file: File) {
  const reader = new FileReader()
  reader.onload = (e) => imagesPreview.value.push(e.target ? <string>e.target.result : "");
  reader.readAsDataURL(file);
}



//web example 
//https://github.com/edu-fedorae/vuetify-components/blob/main/src/components/ImageUploadPreview.vue
/*
async function selectImage(e) {
  const file = e;
  if (!file) return;
  const readData = (f) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(f);
    });
  const data = await readData(file);
}
*/
</script>
