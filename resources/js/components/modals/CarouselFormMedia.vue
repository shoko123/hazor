

<template>
  <v-card-text v-if="media">
     <v-row no-gutters class="text-h5">
      Media for {{ module }} "{{ tag }}"
    </v-row>
    <v-row wrap no-gutters>
      <v-textarea v-model="short" label="Description" class="mr-1" rows="3" readonly filled></v-textarea>
    </v-row>
      <v-row no-gutters>
      <v-text-field v-model="media.file_name" label="File Name" class="mr-1" readonly filled> </v-text-field>
    </v-row>
    <v-row no-gutters>
      <v-text-field v-model="media.collection_name" label="Group" class="mr-1" readonly filled></v-text-field>
      <v-text-field v-model="media.size" label="Size" class="mr-1" readonly filled></v-text-field>
    </v-row>
  
    
  </v-card-text>
  <v-card-actions>
    <v-btn @click="goto" variant="outlined">Go To "{{ tag }}"</v-btn>
    <v-btn @click="download" variant="outlined">Download</v-btn>
  </v-card-actions>
</template>

<script lang="ts" setup >
import { TMediaRecord } from '@/js/types/mediaTypes'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import { useItemStore } from '../../scripts/stores/item'
import { useCarouselStore } from '../../scripts/stores/modals/carousel'
const { getRouteInfo } = useRoutesMainStore()
const router = useRouter()
const routeInfo = getRouteInfo()
const c = useCarouselStore()
const i = useItemStore()

const media = computed(() => {
  return c.itemDetails as unknown as TMediaRecord
})

const tag = computed(() => {
  return i.tag
})

const short = computed(() => {
  return i.short
})
const module = computed(() => {
  return routeInfo.value.module
})

async function download() {
  downloadFile(c.media.urls.full, media.value.file_name)
}

async function goto() {
  await c.close()
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
