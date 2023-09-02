<template>
  <v-card class="mx-auto" color="transparent" flat>
    <v-card-text>
      Overlay Related</v-card-text>
  </v-card>
</template>
    
<script lang="ts" setup >
import { TCollectionName } from '../../types/collectionTypes'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import { useCarouselStore } from '../../scripts/stores/modals/carousel'

const { getRouteInfo } = useRoutesMainStore()
const router = useRouter()
const props = defineProps<{
  source: TCollectionName,
  itemIndex: number,
}>()

onMounted(() => {
  //console.log(`Overlay.onMounted props: ${JSON.stringify(props, null, 2)}`)
})

const { open } = useCarouselStore()

</script>