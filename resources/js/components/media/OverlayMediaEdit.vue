<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col class="d-flex justify-space-between">
        <v-btn @click="switchMedia(true)" icon="mdi-arrow-left" variant="text" :disabled="disableLeft"> </v-btn>
        <v-btn class="bg-grey-lighten-1" @click="deleteMedia()">Delete</v-btn>
        <v-btn @click="switchMedia(false)" icon="mdi-arrow-right" variant="text" :disabled="disableRight"> </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup >
import { computed, onMounted } from 'vue'
import { useMediaStore } from '../../scripts/stores/media'
import { useCollectionsStore } from '../../scripts/stores/collections/collections'
import { useCollectionMediaStore } from '../../scripts/stores/collections/collectionMedia'

const props = defineProps<{
  itemIndex: number,
}>()

const m = useMediaStore()
const cm = useCollectionMediaStore()
const { getIpp } = useCollectionsStore()
const record = computed(() => {
  let ipp = getIpp(cm.extra.views[0])
  let indexInPage = props.itemIndex % ipp
  let record = cm.page[indexInPage]
  return record
})

const disableLeft = computed(() => {
  return (cm.array.length === 1 || props.itemIndex === 0)
})

const disableRight = computed(() => {
  return (cm.array.length === 1 || props.itemIndex === cm.array.length - 1)
})

function switchMedia(withLeft: boolean) {
  console.log(`switchMedia with ${withLeft === true ? "Left" : "Right"}`)
  m.orderChanged = true
  cm.switchArrayItems(props.itemIndex, withLeft ? props.itemIndex - 1 : props.itemIndex + 1 )  
}

function edit() {
  console.log(`edit${5}`)
}
function deleteMedia() {
  if (!confirm("Are you sure you want to delete this media item?")) { return }
  m.destroy(record.value.id)
}
</script>
