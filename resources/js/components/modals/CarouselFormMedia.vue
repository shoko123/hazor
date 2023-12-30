

<template>
  <v-card-text v-if="itemMedia">
     <v-row no-gutters class="text-h5">
      Media for {{ derived.moduleAndTag }}
    </v-row>
    <v-row wrap no-gutters>
      <v-textarea v-model="derived.short" label="Description" class="mr-1" rows="3" readonly filled></v-textarea>
    </v-row>
      <v-row no-gutters>
      <v-text-field v-model="itemMedia.file_name" label="File Name" class="mr-1" readonly filled> </v-text-field>
    </v-row>
    <v-row no-gutters>
      <v-text-field v-model="itemMedia.collection_name" label="Group" class="mr-1" readonly filled></v-text-field>
      <v-text-field v-model="itemMedia.size" label="Size" class="mr-1" readonly filled></v-text-field>
    </v-row>
  </v-card-text>
  <v-card-actions>
    <v-btn @click="goto" variant="outlined">{{ derived.moduleAndTag }}</v-btn>
    <!-- <v-btn @click="download" variant="outlined">Download</v-btn> -->
  </v-card-actions>
</template>

<script lang="ts" setup >
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import { useItemStore } from '../../scripts/stores/item'
import { useCarouselStore } from '../../scripts/stores/modals/carousel'
const { getRouteInfo } = useRoutesMainStore()
const router = useRouter()
const routeInfo = getRouteInfo()
const {close} =useCarouselStore()
const {itemMedia} = storeToRefs(useCarouselStore())
const {derived} = storeToRefs(useItemStore())

async function download() {
  downloadFile(<string>itemMedia.value?.media.urls.full, <string>itemMedia.value?.file_name)
}

async function goto() {
  await close()
}

async function downloadFile(url: string, filename: string) {
  try {
    // Fetch the file
    const response = await fetch(url);
    
    // Check if the request was successful
    if (response.status !== 200) {
      throw new Error(`Unable to download file. HTTP status: ${response.status}`);
    }

    // Get the Blob data
    const blob = await response.blob();

    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = filename;

    // Trigger the download
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Clean up
    setTimeout(() => {
      URL.revokeObjectURL(downloadLink.href);
      document.body.removeChild(downloadLink);
    }, 100);
  } catch (error: any) {
    console.error('Error downloading the file:', error.message);
  }
}


</script>
