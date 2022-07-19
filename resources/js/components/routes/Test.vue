<template>
  <v-card class="mx-auto" width="400" prepend-icon="mdi-home">
    <template v-slot:title>
      TEST
    </template>

    <v-card-text>
      Carousel: {{ mediaStore.carousel }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { useMediaStore } from '@/scripts/stores/media'
const mediaStore = useMediaStore()
const txt = 'hhh'
</script>
