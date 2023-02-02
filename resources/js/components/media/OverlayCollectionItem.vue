<template>
  <v-card class="mx-auto" color="transparent" flat>
    <!-- <v-card-text class="text-body-1 white--text"> {{text}}
    </v-card-text> -->
    <v-card-actions>
      <v-btn class="but" @click="goTo(item)">Visit</v-btn>
      <v-btn class="but" @click="openModalCarousel()">Lightbox</v-btn>
    </v-card-actions>
  </v-card>
  <!--h5 v-if="hasMedia">{{ text }}</h5-->

</template>
    

<script lang="ts" setup >
import { TCollectionName, IMediaItem } from '../../types/collectionTypes'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import { useCarouselStore } from '../../scripts/stores/modals/carousel';

const { getRouteInfo } = useRoutesMainStore()
const router = useRouter()
const props = defineProps<{
  source: TCollectionName,
  itemIndex: number,
  item: IMediaItem,
  pageNoB1?: number,
}>()

onMounted(() => {
  //console.log(`Overlay.onMounted props: ${JSON.stringify(props, null, 2)}`)
})

const { open } = useCarouselStore()

const text = computed(() => {
  if (props.item.description === null) {
    return "";
  } else {
    return props.item.description.length < 101 ? props.item.description : props.item.description.substr(0, 100) + "...";
  }
})

function openModalCarousel() {
  console.log(`Open carousel clicked .....`)
  open(props.source, props.itemIndex)
}

function goTo(item: IMediaItem) {
  console.log(`goto item: ${JSON.stringify(item, null, 2)}`)
  let routeInfo = getRouteInfo()
  router.push({ name: 'show', params: { module: routeInfo.value.url_module, url_id: item.id } })
}


</script>

<style scoped>
.but {
  background-color: rgb(118, 127, 123);
}
</style>