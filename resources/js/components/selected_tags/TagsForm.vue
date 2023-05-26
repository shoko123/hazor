<template>
  <v-card class="elevation-12">
    <v-card-title id="title" class="grey py-0 mb-4">{{ details.header }}</v-card-title>
    <v-card-text>
      <div v-if="!trio.length">{{ details.emptyTitle }}</div>
      <v-list v-if="trio.length">
        <v-list-item v-for="cat in trio">
          <div class="font-weight-bold">{{ cat.catName }}</div>
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
import { useTrioStore } from '../../scripts/stores/trio';
import { TrioSourceName } from '../../types/trioTypes'

let { selectedTrio } = useTrioStore()
const props = defineProps<{
  source: TrioSourceName
}>()

const details = computed(() => {
  switch (props.source) {
    case 'Filter':
      return { header: `Selected Filters`, emptyTitle: `[ No filters selected ]` }

    case 'Item':
      return { header: `Tags for Item`, emptyTitle: `[ Item has no tags ]` }

    case 'New':
      return { header: `Selected Tags`, emptyTitle: `[ No tags selected ]` }
  }
})

const trio = computed(() => {
  return selectedTrio(props.source)
})

</script>
<style scoped>
#title {
  background-color: grey;
}
</style>
