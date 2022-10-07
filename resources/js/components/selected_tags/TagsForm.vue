<template>
  <v-card class="elevation-12">
    <v-card-title id="title" class="grey py-0 mb-4">Selected Tags</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item v-for="group in groups">

            <v-list-item-title>
              <v-container fluid class="pa-0 ma-0">
                <v-row wrap no-gutters>
                  <div class="font-weight-bold">{{ group.groupName }}:</div>
                  <v-chip v-for="param in group.params" class="pa-2 ml-2 mb-1">{{ param }}</v-chip>
                </v-row>
              </v-container>
            </v-list-item-title>
            <v-row></v-row>

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
let { selectedFilters } = storeToRefs(useTrioStore())

const props = defineProps<{
  source: string
}>()
const groups = computed(() => {
  return selectedFilters.value
})
const noSelected = computed(() => {
  return 3
})



/*
    groups() {
      switch (this.source) {
        case "itemParams":
          return this.$store.getters[`aux/selectedItemParams`];
        case "filters":
          return this.$store.getters[`aux/selectedFilters`];
        case "newParams":
          return this.$store.getters[`aux/selectedNewParams`];
        default:
          console.log(
            `******TagsForm: Wrong source argument (${this.source})`
          );
      }
    },

    noSelected() {
      return this.groups.reduce(
        (accumulator, type) => accumulator + type.count,
        0
      );
    },

    header() {
      switch (this.source) {
        case "itemParams":
          return `${this.$store.getters["mgr/module"]} Tags (${this.noSelected})`;
        case "filters":
          return `${this.$store.getters["mgr/module"]} Active Filters (${this.noSelected})`;
        case "newParams":
          return `Selected Tags (${this.noSelected})`;
        default:
          console.log(
            `******Wrong source argument (${this.source})for groups()`
          );
      }
    },
   
  }, */

</script>
<style scoped>
  #title {
    background-color: grey;
  }
  </style>
