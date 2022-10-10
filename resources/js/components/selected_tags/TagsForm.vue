<template>
  <v-card class="elevation-12">
    <v-card-title id="title" class="grey py-0 mb-4">Selected Tags</v-card-title>
    <v-card-text>
      <div v-if="!selectedFiltersTrio.length">[ No filters selected ]</div>
      <v-list v-if="selectedFiltersTrio.length">
        <v-list-item v-for="cat in selectedFiltersTrio">
          <div  class="font-weight-bold">{{ cat.catName}}</div>
          <v-list-item v-for="group in cat.groups">
            <v-list-item-title>
              <v-container fluid class="pa-0 ma-0">
                <v-row class="pa-2 ma-2">
                  <div>{{ group.groupName }}:</div>
                  <v-chip v-for="param in group.params" class="ml-2 mb-2">{{ param }}</v-chip>
                </v-row>
              </v-container>
            </v-list-item-title>
            <v-row></v-row>
          </v-list-item>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup >
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import SubMenuFilter from './SubMenuFilter.vue';
import { useTrioStore } from '../../scripts/stores/trio';
let { selectedFiltersTrio } = storeToRefs(useTrioStore())

const props = defineProps<{
  source: string
}>()







</script>
<style scoped>
#title {
  background-color: grey;
}
</style>
