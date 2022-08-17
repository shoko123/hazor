<template>
  <v-container fluid class="pa-1">
    <component :is=Collection source="main" />
  </v-container>
</template>

<script lang="ts" setup>
import { defineComponent, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import Collection from './collections/Collection.vue'
//import { useStatusStore } from '../../../scripts/stores/status';
defineComponent({
  name: "Index",
  components: {
    Collection,

  }
})

const xx = computed(() => {
  return 'main'
})

// const page = computed({
//   get: () => 0,
//   set: val => {
//     console.log(`page set to ${val}`)
//   }
// })

</script>
