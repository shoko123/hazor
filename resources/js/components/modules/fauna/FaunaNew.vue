<template>
  <v-container fluid class="pa-1 ma-0">

    <v-row wrap no-gutters>
      <v-text-field label="Label" v-model="data.label" :error-messages="labelErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="Area" v-model="data.area" :error-messages="areaErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="locus" v-model="data.locus" :error-messages="locusErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="basket" v-model="data.basket" :error-messages="basketErrors" class="mr-1" filled>
      </v-text-field>
      <v-text-field label="Item Category" v-model="data.item_category" :error-messages="item_categoryErrors" class="mr-1"
        filled> </v-text-field>
    </v-row>

    <v-row>
      <v-text-field label="Label" v-model="data.label" :error-messages="labelErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="Label" v-model="data.label" :error-messages="labelErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="Label" v-model="data.label" :error-messages="labelErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="Label" v-model="data.label" :error-messages="labelErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="Label" v-model="data.label" :error-messages="labelErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="Label" v-model="data.label" :error-messages="labelErrors" class="mr-1" filled> </v-text-field>
    </v-row>
    <slot name="data" v-bind:v$=v$ v-bind:data=data v-bind:id=fields.id></slot>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, reactive, computed } from "vue"
import { storeToRefs } from 'pinia'
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
import { TFaunaFieldsToStore } from '@/js/types/moduleFieldsTypes'
import { useFaunaStore } from '../../../scripts/stores/modules/fauna'

onMounted(() => {
  data.label = fields.value.label
  data.area = fields.value.area
  data.locus = fields.value.locus
  data.basket = fields.value.basket
  data.item_category = fields.value.item_category
  data.biological_taxonomy = fields.value.biological_taxonomy
  data.has_taxonomic_identifier = fields.value.has_taxonomic_identifier
  data.has_anatomical_identifier = fields.value.has_anatomical_identifier
  data.stratum = fields.value.stratum
  data.taxon = fields.value.taxon_id
  data.element = fields.value.element
  data.fragment_present = fields.value.fragment_present
  data.bone_number = fields.value.bone_number
  data.snippet = fields.value.snippet
  console.log(`FaunaNew.Mount fields: ${JSON.stringify(data, null, 2)}`)
})

let { fields } = storeToRefs(useFaunaStore())

const data: TFaunaFieldsToStore = reactive({
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
})

const rules = computed(() => {
  return {
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

const item_categoryErrors = computed(() => {
  return <string>(v$.value.item_category.$error ? v$.value.item_category.$errors[0].$message : undefined)
})
</script>