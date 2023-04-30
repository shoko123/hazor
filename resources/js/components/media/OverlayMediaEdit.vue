<template>
  <v-card class="mx-auto" color="transparent" flat>
    <v-card-actions>
      <v-btn class="but" @click="deleteMedia()">Delete</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup >
import { TCollectionName } from '../../types/collectionTypes'
import { TImageableDetailsMedia } from '../../types/mediaTypes'
import { useMediaStore } from '../../scripts/stores/media'

const props = defineProps<{
  source: TCollectionName,
  itemIndex: number,
  details: TImageableDetailsMedia
}>()

const m = useMediaStore()

function deleteMedia() {
  if (!confirm("Are you sure you want to delete this media item?")) { return }
  m.destroy(props.details.id)
}
</script>

<style scoped>
.but {
  background-color: rgb(118, 127, 123);
}
</style>