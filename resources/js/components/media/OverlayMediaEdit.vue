<template>
  <v-row
    justify="space-between"
    align="center"
  >
    <v-btn
      icon="mdi-arrow-left"
      variant="text"
      :disabled="disableLeft"
      @click="switchMedia(true)"
    />
    <v-btn
      class="bg-grey-lighten-1"
      @click="deleteMedia()"
    >
      Delete
    </v-btn>
    <v-btn
      icon="mdi-arrow-right"
      variant="text"
      :disabled="disableRight"
      @click="switchMedia(false)"
    />
  </v-row>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { TPageMediaGallery } from '../../types/collectionTypes'
import { useMediaStore } from '../../scripts/stores/media'
import { useCollectionMediaStore } from '../../scripts/stores/collections/collectionMedia'

const props = defineProps<{  
  itemIndex: number,
  record: TPageMediaGallery  
}>()

const m = useMediaStore()
const cm = useCollectionMediaStore()

const disableLeft = computed(() => {
  return (cm.array.length === 1 || props.itemIndex === 0)
})

const disableRight = computed(() => {
  return (cm.array.length === 1 || props.itemIndex === cm.array.length - 1)
})

function switchMedia(withLeft: boolean) {
  console.log(`switchMedia with ${withLeft === true ? "Left" : "Right"}`)
  m.orderChanged = true
  cm.switchArrayItems(props.itemIndex, withLeft ? props.itemIndex - 1 : props.itemIndex + 1)
}

// function edit() {
//   //TODO edit media text
// }

function deleteMedia() {
  if (!confirm("Are you sure you want to delete this media item?")) { return }
  m.destroy(props.record.id)
}
</script>
