<template>
  <v-card class="mx-auto" color="transparent" flat>
    <v-card-text class="text-body-1 white--text"> {{text}}
    </v-card-text>
    <v-card-actions>
      <v-btn @click="goTo(item)">Visit</v-btn>
      <v-btn @click="openLightBox()">Lightbox</v-btn>
    </v-card-actions>
  </v-card>
  <!--h5 v-if="hasMedia">{{ text }}</h5-->

</template>
    

<script lang="ts" setup >
import { TSource, IMediaItem } from '../../types/collectionTypes'
import { computed, onMounted } from 'vue'
const props = defineProps<{
  source: TSource,
  item: IMediaItem,
  pageNoB1?: number,
}>()

onMounted(() => {
  // text content should be the same as current `count.value`
  console.log(`Overlay.onMounted props: ${JSON.stringify(props, null, 2)}`)
})
const text = computed(() => {
  if (props.item.description === null) {
    return "";
  } else {
    return props.item.description.length < 101 ? props.item.description : props.item.description.substr(0, 100) + "...";
  }
})




function openLightBox() {

}

function goTo(item: IMediaItem) {

}


</script>

