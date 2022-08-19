<template>
  <v-container fluid class="pa-1">
    <component :is=Collection source="main" />
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import Collection from './collections/Collection.vue'

const xx = computed(() => {
  return 'main'
})

</script>
