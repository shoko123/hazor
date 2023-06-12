<template>
  <v-card class="mx-auto" color="transparent" flat>
    <!-- <v-card-text class="text-body-1 white--text"> {{text}}
    </v-card-text> -->
    <v-card-actions>
      <v-btn class="but" @click="goTo(<TImageableDetailsMain>details)">Visit</v-btn>
      <v-btn class="but" @click="openModalCarousel()">Lightbox</v-btn>
    </v-card-actions>
  </v-card>
  <!--h5 v-if="hasMedia">{{ text }}</h5-->
</template>
    

<script lang="ts" setup >
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { TCollectionName } from '../../types/collectionTypes'
import { TImageableDetailsMain } from '../../types/mediaTypes'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import { useCarouselStore } from '../../scripts/stores/modals/carousel'
import { storeToRefs } from 'pinia'
import type { LocationQueryRaw } from 'vue-router'


const router = useRouter()
const props = defineProps<{
  source: TCollectionName,
  itemIndex: number,
  details: TImageableDetailsMain
}>()

let { current } = storeToRefs(useRoutesMainStore())
onMounted(() => {
  //console.log(`Overlay.onMounted props: ${JSON.stringify(props, null, 2)}`)
})

const { open } = useCarouselStore()

const text = computed(() => {
  if (props.details.description === null) {
    return "";
  } else {
    return props.details.description.length < 101 ? props.details.description : props.details.description.substr(0, 100) + "...";
  }
})

function openModalCarousel() {
  //console.log(`Open carousel clicked .....`)
  open(props.source, props.itemIndex )
}

function goTo(item: TImageableDetailsMain) {
  console.log(`goto item: ${JSON.stringify(item, null, 2)}`)
  let queryParams = current.value.queryParams
  router.push({ name: 'show', params: { module: current.value.url_module, url_id: item.url_id }, query: <LocationQueryRaw>queryParams})
  //router.push({ name: 'index', params: { module: current.value.url_module }, query: query })
}


</script>

<style scoped>
.but {
  background-color: rgb(118, 127, 123);
}
</style>