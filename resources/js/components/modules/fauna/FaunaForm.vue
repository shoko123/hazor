<template>
  <v-container v-if="item" fluid class="pa-1 ma-0">
    <v-row wrap no-gutters>
      <v-text-field v-model="item.id" label="ID" rows="1" class="mr-1 mt-1" auto-grow readonly filled>
      </v-text-field>

      <v-text-field label="Label" v-model="item.label" v-show="item.label" class="mr-1" auto-grow readonly filled>
      </v-text-field>

      <v-text-field label="Area" v-model="item.area" v-show="item.area" class="mr-1" filled>
      </v-text-field>

      <v-text-field label="Locus" v-model="item.locus" v-show="item.locus" class="mr-1" filled>
      </v-text-field>

      <v-text-field label="Basket" v-model="item.basket" v-show="item.basket" class="mr-1" filled>
      </v-text-field>

    </v-row>

    <v-row wrap no-gutters>
      <v-text-field label="Taxon" v-model="item.taxon" v-show="item.taxon" class="mr-1" filled></v-text-field>
      <v-text-field label="Element" v-model="item.element" v-show="item.element" class="mr-1" filled></v-text-field>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup >

import { TFaunaFields } from '../../../types/itemTypes'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useItemStore } from '../../../scripts/stores/item'

let i = useItemStore()


const item = computed(() => {
  return i.fields as unknown as TFaunaFields
})





</script>
<style scoped>
#title {
  background-color: grey;
}
</style>
