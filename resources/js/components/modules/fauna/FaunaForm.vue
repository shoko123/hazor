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
      <v-text-field label="Base Taxon" v-model="item.base_taxon_id" class="mr-1" readonly filled>
      </v-text-field>
      <v-text-field label="Taxon" v-model="item.taxon" class="mr-1" readonly filled>
      </v-text-field>
      <v-text-field label="Taxon Common Name" v-model="item.taxon_common_name" class="mr-1" readonly filled>
      </v-text-field>
    </v-row>

    <v-row wrap no-gutters>
      <v-text-field label="Base Element Group" v-model="item.base_element_id" class="mr-1" filled> </v-text-field>
      <v-text-field label="Anatomical Label" v-model="item.anatomical_label" class="mr-1" filled> </v-text-field>
      <v-text-field label="Element" v-model="item.element" class="mr-1" filled> </v-text-field>
      <v-text-field label="Fragment Present" v-model="item.fragment_present" class="mr-1" filled> </v-text-field>
      <v-text-field label="Symmetry" v-model="item.symmetry" class="mr-1" filled> </v-text-field>
      <v-text-field label="Fusion Proximal" v-model="item.fusion_proximal" class="mr-1" filled> </v-text-field>
      <v-text-field label="Fusion Distal" v-model="item.fusion_distal" class="mr-1" filled> </v-text-field>
    </v-row>

    <v-row wrap no-gutters>
      <v-text-field label="Age" v-model="item.age" class="mr-1" filled> </v-text-field>
      <v-text-field label="Phase" v-model="item.phase" class="mr-1" filled> </v-text-field>
      <v-text-field label="Modifications" v-model="item.modifications" class="mr-1" filled> </v-text-field>
    </v-row>
  </v-container>
</template>


<script lang="ts" setup >
/*
id: number,
uri: string,
diagnostic: boolean,
label: string,
area: string,
locus: string,
basket: string,
stratum: string,
registration_clean: boolean,
base_taxon_id: number,
taxon: string,
taxon_common_name: string,
fragment_present: string,
symmetry: string,
fusion_proximal: string,
fusion_distal: string,
base_element_id: number,
anatomical_label: string,
element: string,
age: string,
phase: string,
modifications: string,
context_uri: string
*/
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

