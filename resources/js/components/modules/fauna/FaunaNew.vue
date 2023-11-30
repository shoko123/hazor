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
      <v-checkbox label="Registration Clean" v-model="clean"></v-checkbox>
      <!-- <v-text-field label="Registration Clean" v-model="data.registration_clean" :error-messages="item_categoryErrors"
        class="mr-1" filled> </v-text-field> -->
    </v-row>

    <v-row>
      <v-text-field label="Taxon" v-model="data.taxon" :error-messages="taxonErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="Common Name" v-model="data.taxon_common_name" class="mr-1" filled> </v-text-field>
      <v-text-field label="Anatomical Label" v-model="data.anatomical_label" class="mr-1" filled>
      </v-text-field>
      <v-text-field label="Element" v-model="data.element" class="mr-1" filled> </v-text-field>
    </v-row>
    <v-row>
      <v-text-field label="Fragment Present" v-model="data.fragment_present" class="mr-1" filled>
      </v-text-field>
      <v-text-field label="Modifications" v-model="data.modifications" class="mr-1" filled> </v-text-field>
      <v-text-field label="Phase" v-model="data.phase" class="mr-1" filled> </v-text-field>
      <v-text-field label="Age" v-model="data.age" class="mr-1" filled> </v-text-field>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, reactive, computed } from "vue"
import { storeToRefs } from 'pinia'
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength, minValue, maxValue, between } from "@vuelidate/validators";
import { TFaunaFields } from '@/js/types/moduleFieldsTypes'
import { useItemStore } from '../../../scripts/stores/item'

const props = defineProps<{
  isCreate: boolean
}>()

let { fields } = storeToRefs(useItemStore())

onMounted(() => {
  if (!props.isCreate) {
    Object.assign(data, fields.value)
  }
  console.log(`FaunaNew.Mount fields: ${JSON.stringify(data, null, 2)}`)
})


const data: TFaunaFields = reactive({
  id: 0,
  uri: "",
  label: "",
  area: "",
  locus: "",
  basket: "",
  stratum: "",
  registration_clean: 1,
  taxon: "",
  taxon_common_name: "",
  base_taxon_id: 1,
  fragment_present: "",
  anatomical_label: "",
  element: "",
  modifications: "",
  phase: "",
  age: "",
  scope_id: 1,
  material_id: 1,
  symmetry_id: 1,
  fusion_proximal_id: 1,
  fusion_distal_id: 1
})

const rules = computed(() => {
  return {
    id: {},
    label: { required },
    area: { maxLength: maxLength(12) },
    locus: { minValue: minValue(1261), maxValue: maxValue(8705) },
    basket: { minValue: minValue(12355), maxValue: maxValue(55315) },
    stratum: { maxLength: maxLength(30) },
    registration_clean: {},
    taxon: { maxLength: maxLength(40) },
    taxon_common_name: { maxLength: maxLength(40) },
    fragment_present: { maxLength: maxLength(15) },
    anatomical_label: { maxLength: maxLength(40) },
    element: { maxLength: maxLength(40) },
    modifications: { maxLength: maxLength(30) },
    phase: { maxLength: maxLength(20) },
    age: { maxLength: maxLength(20) },
  }
})

const clean = computed({
  get: () => { return data.registration_clean ? true : false},
  set: val => {
    data.registration_clean = val ? 1 : 0
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
  return <string>(v$.value.stratum.$error ? v$.value.stratum.$errors[0].$message : undefined)
})

const registration_cleanErrors = computed(() => {
  return <string>(v$.value.registration_clean.$error ? v$.value.registration_cleanErrors.$errors[0].$message : undefined)
})

const taxonErrors = computed(() => {
  return <string>(v$.value.taxon.$error ? v$.value.taxon.$errors[0].$message : undefined)
})
</script>