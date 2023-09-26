

<template>
    <div id="zoomy-container" height="100vh">
        <v-img id="zoomy" :src="urls.full" :lazy-src="urls.tn" aspect-ratio="1" height="95vh" :cover=false>
        </v-img>
    </div>
</template>
  
<script lang="ts" setup >

import { computed, onMounted, onBeforeUnmount, watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCarouselStore } from '../../scripts/stores/modals/carousel'
import Zoomy from './zoomy/Zoomy.js'

onMounted(() => {
    //console.log(`ImageZoom.mount`)
    zm.value = new Zoomy('zoomy', options);
})

onBeforeUnmount(() => {
    //console.log(`ImageZoom.unmount`)
    zm.value?.detach()
    zm.value = null
})

const zm = ref<Zoomy | null>(null)

const options = {
    zoomUpperConstraint: 8, // Upper limit for zooming (optional)
    boundaryElementId: 'zoomy-container',
};

const { media } = storeToRefs(useCarouselStore())

watch(media, () => {
    //console.log('ImageZoom.media changed')
    zm.value?.detach()
    zm.value = new Zoomy('zoomy', options)
})

const urls = computed(() => {
    return media.value?.urls
})

</script>
