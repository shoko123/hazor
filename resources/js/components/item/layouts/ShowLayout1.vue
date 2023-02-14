<template>
  <v-card class="elevation-12">
    <v-card-title id="title" class="grey py-0 mb-4">Selected Filters</v-card-title>
    <v-card-text>
   
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup >
import { computed } from 'vue'


const props = defineProps<{
  source: string
}>()

const trio = computed(() => {
  return "xxx"
})





</script>
<style scoped>
#title {
  background-color: grey;
}
</style>
