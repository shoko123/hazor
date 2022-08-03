<template>
  <div id="home">
    <v-carousel height="100%" continuos cycle>
      <v-carousel-item v-for="(item, i) in items" :key="i" :src="item.fullUrl" :lazy-src="item.tnUrl">
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script setup lang="ts" >
import { useMainStore } from '../../scripts/stores/main'
import { computed } from "vue";

let main = useMainStore()

type TMediaItem = {
  fullUrl: string,
  tnUrl: string
}

const items = computed(() => {
  let c: Array<TMediaItem> = [];
  for (let i = 1; i <= 6; i++) {
    c.push({
      fullUrl: `${main.bucketUrl}app/carousel/hazor${i}.jpg`,
      tnUrl: `${main.bucketUrl}app/carousel/hazor${i}-tn.jpg`
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
