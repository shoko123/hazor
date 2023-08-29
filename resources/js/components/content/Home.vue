<template>
  <div id="home">
    <v-carousel height="100%" continuos cycle>
      <v-carousel-item v-for="(media1, i) in media" :key="i" :src="media1.urls.full" :lazy-src="media1.urls.tn"
        :cover="true">
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script setup lang="ts" >
import { computed } from 'vue'
import { useMediaStore } from '../../scripts/stores/media'
import { TMediaOfItem } from '../../types/mediaTypes'
import { storeToRefs } from 'pinia'
let { bucketUrl } = storeToRefs( useMediaStore())

const media = computed(() => {
 
  let c: Array<TMediaOfItem> = [];
  for (let i = 1; i <= 6; i++) {
    c.push({
      hasMedia: true,
      urls: {
        full: `${bucketUrl.value}app/carousel/hazor${i}.jpg`,
        tn: `${bucketUrl.value}app/carousel/hazor${i}-tn.jpg`
      }
    })
  }
  return c;
});
</script>

<style scoped>
#home {
  height: 95vh;
}
</style>
