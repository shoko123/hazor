

<template>
    <div id="zoomy-container" height="100vh">
        <v-img id="zoomy" :src="urls?.full" :lazy-src="urls?.tn" aspect-ratio="1" height="95vh" :cover="isFiller">
            <v-overlay v-model="isFiller" contained class="align-center justify-center">
                <div class="text-white text-h2">No Media Available</div>
            </v-overlay>
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
    if (getMedia.value?.hasMedia) {
        zm.value = new Zoomy('zoomy', options);
    } else {
        zm.value?.detach()
        zm.value = null
    }
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

//const { media } = storeToRefs(useCarouselStore())
const { getMedia } = storeToRefs(useCarouselStore())

watch(getMedia, () => {
    //console.log('ImageZoom.media changed')
    zm.value?.disable()
    zm.value?.detach()
    if (getMedia.value?.hasMedia) {
        zm.value = new Zoomy('zoomy', options)
    } else {
        zm.value = null
    }
})

const urls = computed(() => {
    return getMedia.value?.urls
})

//isFiller includes a set function as v-overlays requires a modifiable boolean
const isFiller = computed({
    get: () => { return !getMedia.value?.hasMedia },
    set: val => { }
})
</script>
