<template>
  <v-card class="mx-auto" color="transparent" flat>
    <!-- <v-card-text class="text-body-1 white--text"> {{text}}
    </v-card-text> -->
    <v-card-actions>
      <v-btn class="but" @click="goTo(<TMediaDetailsCMain>details)">Visit</v-btn>
      <v-btn class="but" @click="openModalCarousel()">Lightbox</v-btn>
    </v-card-actions>
  </v-card>
  <!--h5 v-if="hasMedia">{{ text }}</h5-->
</template>
    

<script lang="ts" setup >
import { TCollectionName } from '../../types/collectionTypes'
import { TMedia, TMediaDetailsCMain, TMediaDetailsCMedia } from '../../types/mediaTypes'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import { useCarouselStore } from '../../scripts/stores/modals/carousel'

const { getRouteInfo } = useRoutesMainStore()
const router = useRouter()
const props = defineProps<{
  source: TCollectionName,
  itemIndex: number,
  details: TMediaDetailsCMain
}>()

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
  console.log(`Open carousel clicked .....`)
  let routeInfo = getRouteInfo()
  open(props.source, props.itemIndex)
}

function goTo(item: TMediaDetailsCMain) {
  console.log(`goto item: ${JSON.stringify(item, null, 2)}`)
  let routeInfo = getRouteInfo()
  router.push({ name: 'show', params: { module: routeInfo.value.url_module, url_id: item.url_id } })
}


</script>

<style scoped>
.but {
  background-color: rgb(118, 127, 123);
}
</style>