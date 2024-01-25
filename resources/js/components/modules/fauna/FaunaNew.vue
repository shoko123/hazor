<template>
  <v-container
    fluid
    class="pa-1 ma-0"
  >
    <slot
      :id="data.id"
      name="data"
      :v="v"
      :data="data"
    />
    <v-row
      wrap
      no-gutters
    >
      <v-text-field
        v-model="data.label"
        label="Label"
        :error-messages="labelErrors"
        class="mr-1"
        filled
      />
      <v-text-field
        v-model="data.area"
        label="Area"
        :error-messages="areaErrors"
        class="mr-1"
        filled
      />
      <v-text-field
        v-model="data.locus"
        label="locus"
        :error-messages="locusErrors"
        class="mr-1"
        filled
      />
      <v-text-field
        v-model="data.basket"
        label="Basket"
        :error-messages="basketErrors"
        class="mr-1"
        filled
      />
      <v-text-field
        v-model="data.stratum"
        label="Stratum"
        :error-messages="stratumErrors"
        class="mr-1"
        filled
      />
      <v-checkbox
        v-model="clean"
        label="Registration Clean"
      />
      <!-- <v-text-field label="Registration Clean" v-model="data.registration_clean" :error-messages="item_categoryErrors"
        class="mr-1" filled> </v-text-field> -->
    </v-row>

    <v-row>
      <v-text-field
        v-model="data.taxon"
        label="Taxon"
        :error-messages="taxonErrors"
        class="mr-1"
        filled
      />
      <v-text-field
        v-model="data.taxon_common_name"
        label="Common Name"
        class="mr-1"
        filled
      />
      <v-text-field
        v-model="data.anatomical_label"
        label="Anatomical Label"
        class="mr-1"
        filled
      />
      <v-text-field
        v-model="data.element"
        label="Element"
        class="mr-1"
        filled
      />
    </v-row>
    <v-row>
      <v-text-field
        v-model="data.fragment_present"
        label="Fragment Present"
        class="mr-1"
        filled
      />
      <v-text-field
        v-model="data.modifications"
        label="Modifications"
        class="mr-1"
        filled
      />
      <v-text-field
        v-model="data.phase"
        label="Phase"
        class="mr-1"
        filled
      />
      <v-text-field
        v-model="data.age"
        label="Age"
        class="mr-1"
        filled
      />
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, reactive, computed } from "vue"
import { storeToRefs } from 'pinia'
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength, minValue, maxValue } from "@vuelidate/validators";
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

const v = useVuelidate(rules, data)

const labelErrors = computed(() => {
  return <string>(v.value.label.$error ? v.value.label.$errors[0].$message : undefined)
})
const areaErrors = computed(() => {
  return <string>(v.value.area.$error ? v.value.area.$errors[0].$message : undefined)
})

const locusErrors = computed(() => {
  return <string>(v.value.locus.$error ? v.value.locus.$errors[0].$message : undefined)
})

const basketErrors = computed(() => {
  return <string>(v.value.basket.$error ? v.value.basket.$errors[0].$message : undefined)
})

const stratumErrors = computed(() => {
  return <string>(v.value.stratum.$error ? v.value.stratum.$errors[0].$message : undefined)
})

// const registration_cleanErrors = computed(() => {
//   return <string>(v.value.registration_clean.$error ? v.value.registration_cleanErrors.$errors[0].$message : undefined)
// })

const taxonErrors = computed(() => {
  return <string>(v.value.taxon.$error ? v.value.taxon.$errors[0].$message : undefined)
})
</script>