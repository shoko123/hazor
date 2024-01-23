

<template>
  <v-card-text v-if="item">
    <v-row
      no-gutters
      class="text-h5"
    >
      Media for {{ derived.moduleAndTag }}
    </v-row>
    <v-row
      wrap
      no-gutters
    >
      <v-textarea
        v-model="derived.short"
        label="Description"
        class="mr-1"
        rows="3"
        readonly
        filled
      />
    </v-row>
    <v-row no-gutters>
      <v-text-field
        v-model="item.file_name"
        label="File Name"
        class="mr-1"
        readonly
        filled
      />
    </v-row>
    <v-row no-gutters>
      <v-text-field
        v-model="item.collection_name"
        label="Group"
        class="mr-1"
        readonly
        filled
      />
      <v-text-field
        v-model="item.size"
        label="Size"
        class="mr-1"
        readonly
        filled
      />
    </v-row>
  </v-card-text>
  <v-card-actions>
    <v-btn
      variant="outlined"
      @click="goto"
    >
      {{ derived.moduleAndTag }}
    </v-btn>
    <!-- <v-btn @click="download" variant="outlined">Download</v-btn> -->
  </v-card-actions>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { type TCarouselMedia } from '@/js/types/mediaTypes'
import { useItemStore } from '../../scripts/stores/item'
import { useCarouselStore } from '../../scripts/stores/modals/carousel'

const { close } = useCarouselStore()
const { carouselItemDetails } = storeToRefs(useCarouselStore())
const { derived } = storeToRefs(useItemStore())

const item = computed(() => {
  return <TCarouselMedia | null>carouselItemDetails.value
})

async function download() {
  downloadFile(<string>item.value?.media.urls.full, <string>item.value?.file_name)
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
