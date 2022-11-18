<template>
  <v-card class="mx-auto" color="transparent" flat>
    <!-- <v-card-text class="text-body-1 white--text"> {{text}}
    </v-card-text> -->
    <v-card-actions>
      <v-btn  class="but" @click="goTo(item)">Visit</v-btn>
      <v-btn class="but" @click="openLightBox()">Lightbox</v-btn>
    </v-card-actions>
  </v-card>
  <!--h5 v-if="hasMedia">{{ text }}</h5-->

</template>
    

<script lang="ts" setup >
import { TSource, IMediaItem } from '../../types/collectionTypes'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'

const { current } = storeToRefs(useRoutesMainStore())
const router = useRouter()
const props = defineProps<{
  source: TSource,
  item: IMediaItem,
  pageNoB1?: number,
}>()

onMounted(() => {
  //console.log(`Overlay.onMounted props: ${JSON.stringify(props, null, 2)}`)
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
  console.log(`goto item: ${JSON.stringify(item, null, 2)}`)
  router.push({ name: 'show', params: { module: current.value.url_module, url_id: item.id } })
}


</script>

<style scoped>
.but {
  background-color: rgb(118, 127, 123);
}
</style>