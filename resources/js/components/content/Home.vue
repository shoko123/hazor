<template>
  <div id="home">
    <v-carousel height="100%" continuos cycle>
      <v-carousel-item v-for="(item, i) in items" :key="i" :src="item?.fullUrl" :lazy-src="item?.tnUrl" :cover="true">
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script setup lang="ts" >
import { computed } from 'vue'
import { useMediaStore } from '../../scripts/stores/media'
import { TMediaItem } from '../../types/mediaTypes'

let { getBucketUrl } = useMediaStore()

const items = computed(() => {
  let bucketUrl = getBucketUrl()
  let c: Array<TMediaItem> = [];
  for (let i = 1; i <= 6; i++) {
    c.push({
      fullUrl: `${bucketUrl}app/carousel/hazor${i}.jpg`,
      tnUrl: `${bucketUrl}app/carousel/hazor${i}-tn.jpg`
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
