<template>
  <v-row wrap>
    <v-chip
      v-for="(item, index) in c.main.value.array"
      :key="index"
      
      class="font-weight-normal ma-2 body-1"
      @click="goTo(item)"
      >{{ item?.url_id}}</v-chip
    >
  </v-row>
</template>

<script lang="ts" setup >
import { useCollectionsStore } from '../../../scripts/stores/collections';
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import CollectionPageMedia from './CollectionPageMedia.vue'
import CollectionPageChips from './CollectionPageChips.vue'
import CollectionPageTable from './CollectionPageTable.vue'
import { useStatusStore } from '../../../scripts/stores/status';
let status = storeToRefs(useStatusStore())
let c = storeToRefs(useCollectionsStore())
function goTo(item: any) {
  console.log("goTo")
}
</script>

