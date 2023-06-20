<template>
  <v-container fluid class="pa-1 ma-0">
    <slot name="data" v-bind:v$=v$ v-bind:data=data v-bind:id=data.id></slot>    
    <v-row wrap no-gutters>
      <v-text-field label="Label" v-model="data.label" :error-messages="labelErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="Area" v-model="data.area" :error-messages="areaErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="locus" v-model="data.locus" :error-messages="locusErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="Basket" v-model="data.basket" :error-messages="basketErrors" class="mr-1" filled>
      </v-text-field>
      <v-text-field label="Stratum" v-model="data.stratum" :error-messages="stratumErrors" class="mr-1" filled>
      </v-text-field>      
      <v-text-field label="Item Category" v-model="data.item_category" :error-messages="item_categoryErrors" class="mr-1"
        filled> </v-text-field>
    </v-row>

    <v-row>
      <v-text-field label="Bio Tax" v-model="data.biological_taxonomy"  class="mr-1" filled> </v-text-field>
      <v-text-field label="Has Tax Id" v-model="data.has_taxonomic_identifier" class="mr-1" filled> </v-text-field>
      <v-text-field label="Taxon" v-model="data.taxon" class="mr-1" filled> </v-text-field> 
       <v-text-field label="Has Anatomical Id" v-model="data.has_anatomical_identifier"  class="mr-1" filled> </v-text-field>
      <v-text-field label="Element" v-model="data.element"  class="mr-1" filled> </v-text-field>
      <v-text-field label="Fragment Present" v-model="data.fragment_present"  class="mr-1" filled> </v-text-field>
    </v-row>
    <v-row wrap no-gutters>
        <v-text-field label="Snippet" v-model="data.snippet"  class="mr-1" filled> </v-text-field>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, reactive, computed } from "vue"
import { storeToRefs } from 'pinia'
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
import { TFaunaFields } from '@/js/types/moduleFieldsTypes'
import { useItemStore } from '../../../scripts/stores/item'

const props = defineProps<{
  isCreate: boolean
}>()

let { fields } = storeToRefs(useItemStore())
onMounted(() => {
  const ff = <TFaunaFields>fields.value
  if(!props.isCreate){
  data.id = ff.id
  data.label = ff.label
  data.area = ff.area
  data.locus = ff.locus
  data.basket = ff.basket
  data.item_category = ff.item_category
  data.biological_taxonomy = ff.biological_taxonomy
  data.has_taxonomic_identifier = ff.has_taxonomic_identifier
  data.has_anatomical_identifier = ff.has_anatomical_identifier
  data.stratum = ff.stratum
  data.taxon = ff.taxon
  data.element = ff.element
  data.fragment_present = ff.fragment_present
  data.bone_number = ff.bone_number
  data.snippet = ff.snippet
  data.taxon_id = ff.taxon_id
  data.element_id = ff.element_id
  }
   console.log(`FaunaNew.Mount fields: ${JSON.stringify(data, null, 2)}`)
})

const data: TFaunaFields = reactive({
  id: 0,
  label: "",
  area: "",
  locus: "",
  basket: "",
  item_category: "",
  biological_taxonomy: "",
  has_taxonomic_identifier: "",
  has_anatomical_identifier: "",
  stratum: "",
  taxon: "",
  element: "",
  fragment_present: "",
  bone_number: "",
  snippet: "",
  taxon_id: 1,
  element_id: 1
})

const rules = computed(() => {
  return {
    id: {},
    label: {required},
    area: {},
    locus: {},
    basket: {},
    item_category: {},
    biological_taxonomy: {},
    has_taxonomic_identifier: {},
    has_anatomical_identifier: {},
    stratum: {},
    taxon: {},
    element: {},
    fragment_present: {},
    bone_number: {},
    snippet: {},
    taxon_id: {},
    element_id: {}
  }
})

const v$ = useVuelidate(rules, data)

const labelErrors = computed(() => {
  return <string>(v$.value.label.$error ? v$.value.label.$errors[0].$message : undefined)
})
const areaErrors = computed(() => {
  return <string>(v$.value.area.$error ? v$.value.area.$errors[0].$message : undefined)
})

const locusErrors = computed(() => {
  return <string>(v$.value.locus.$error ? v$.value.locus.$errors[0].$message : undefined)
})

const basketErrors = computed(() => {
  return <string>(v$.value.basket.$error ? v$.value.basket.$errors[0].$message : undefined)
})

const stratumErrors = computed(() => {
  return <string>(v$.value.stratum.$error ? v$.value.basket.$errors[0].$message : undefined)
})

const item_categoryErrors = computed(() => {
  return <string>(v$.value.item_category.$error ? v$.value.item_category.$errors[0].$message : undefined)
})
</script>