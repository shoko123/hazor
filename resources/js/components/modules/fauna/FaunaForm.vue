<template>
  <v-container v-if="item" fluid class="pa-1 ma-0">
    <v-row wrap no-gutters>
      <v-text-field label="label" v-model="item.label" @click="openContextTab()" class="mr-1" variant="outlined" readonly
        append-inner-icon="mdi-map-marker">
      </v-text-field>
      <v-text-field label="Area" v-model="item.area" class="mr-1" readonly filled> </v-text-field>
      <v-text-field label="Locus" v-model="item.locus" class="mr-1" readonly filled> </v-text-field>
      <v-text-field label="Basket" v-model="item.basket" class="mr-1" readonly filled> </v-text-field>
      <v-text-field label="Registration OK" v-model="registratioIsClean" class="mr-1" readonly filled> </v-text-field>
      <v-text-field label="Stratum" v-model="item.stratum" class="mr-1" readonly filled></v-text-field>
    </v-row>

    <v-row wrap no-gutters>
      <v-text-field label="Taxon" v-model="item.taxon" class="mr-1" readonly filled>      </v-text-field>
      <v-text-field label="Taxon Common Name" v-model="item.taxon_common_name" class="mr-1" readonly filled>      </v-text-field>
      <v-text-field label="Anatomical Label" v-model="item.anatomical_label" class="mr-1" filled> </v-text-field>
      <v-text-field label="Element" v-model="item.element" class="mr-1" filled> </v-text-field>
    </v-row>

    <v-row wrap no-gutters>
      <v-text-field label="Fragment Present" v-model="item.fragment_present" class="mr-1" filled> </v-text-field>
      <v-text-field label="Modifications" v-model="item.modifications" class="mr-1" filled> </v-text-field>
      <v-text-field label="Age" v-model="item.age" class="mr-1" filled> </v-text-field>
      <v-text-field label="Phase" v-model="item.phase" class="mr-1" filled> </v-text-field>      
    </v-row>
  </v-container>
</template>


<script lang="ts" setup >

import { TFaunaFields } from '@/js/types/moduleFieldsTypes'
import { computed } from 'vue'
import { useItemStore } from '../../../scripts/stores/item'

let i = useItemStore()


const item = computed(() => {
  return i.fields as unknown as TFaunaFields
})
const registratioIsClean = computed(() => {
  return item.value.registration_clean ? "Yes" : "No"
})
function openContextTab() {
  console.log(`goToOpenContext`)
  window.open(item.value.uri, '_blank', 'noreferrer');
}



</script>

