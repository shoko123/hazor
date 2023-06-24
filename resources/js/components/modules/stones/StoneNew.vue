<template>
  <v-container fluid class="pa-1 ma-0">
    <v-row wrap no-gutters>
      <v-text-field id="area" label="Area" v-model="data.area" :error-messages="areaErrors" class="mr-1" filled>
      </v-text-field>
      <v-text-field id="locus" label="Locus" v-model="data.locus" :error-messages="locusErrors" class="mr-1" filled>
      </v-text-field>
      <v-text-field id="basket" label="Basket" v-model="data.basket" :error-messages="basketErrors" class="mr-1" filled>
      </v-text-field>
      <v-text-field id="stone_no" label="Stone No." v-model="data.stone_no" :error-messages="stone_noErrors" class="mr-1"
        filled>
      </v-text-field>
      <v-text-field id="year" label="Year" v-model="data.year" :error-messages="yearErrors" class="mr-1" filled>
      </v-text-field>
      <v-text-field id="date" label="Date" v-model="data.date" :error-messages="dateErrors" type="date" min="1990-01-01"
        max="2018-12-31"></v-text-field>
    </v-row>

    <v-row wrap no-gutters>
      <v-text-field label="Type" v-model="data.type" :error-messages="typeErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="Material Code" v-model="data.material_code" :error-messages="typeErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="Rim Diameter" v-model="data.rim_diameter" :error-messages="rim_diameterErrors" class="mr-1" filled> </v-text-field>
    </v-row>

    <v-row wrap no-gutters>
      <v-textarea label="Description" v-model="data.description" :error-messages="descriptionErrors" rows="1"
        class="mr-1" auto-grow>
      </v-textarea>
      <v-textarea label="Dimensions" v-model="data.dimensions" :error-messages="dimensionsErrors" rows="1" class="mr-1"
        auto-grow></v-textarea>
    </v-row>
    <v-row wrap no-gutters>
      <v-textarea label="Provenience notes" v-model="data.prov_notes" :error-messages="provErrors" rows="1"
        class="mr-1"></v-textarea>
      <v-textarea label="Notes" v-model="data.notes" :error-messages="notesErrors" rows="1" class="mr-1"></v-textarea>


    </v-row>

    <slot name="data" v-bind:v$=v$ v-bind:data=data v-bind:id=data.id></slot>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, reactive, computed } from "vue"
import { storeToRefs } from 'pinia'
import { useVuelidate } from "@vuelidate/core"
import { required, numeric, minLength, maxLength, minValue, maxValue } from "@vuelidate/validators"
import { TStoneFields } from '@/js/types/moduleFieldsTypes'
import { useStoneStore } from '../../../scripts/stores/modules/stone'
import { useItemStore } from '../../../scripts/stores/item'

const props = defineProps<{
  isCreate: boolean
}>()

onMounted(() => {
  const sf = <TStoneFields>fields.value
  if (!props.isCreate) {
    data.id = sf.id
    data.area = sf.area
    data.locus = sf.locus
    data.basket = sf.basket
    data.stone_no = sf.stone_no
    data.year = sf.year
    data.date = sf.date
    data.prov_notes = sf.prov_notes
    data.material_code = sf.material_code
    data.type = sf.type
    data.description = sf.description
    data.notes = sf.notes
    data.dimensions = sf.dimensions
    data.rim_diameter = sf.rim_diameter
    data.material_id = sf.material_id
    data.base_type_id = sf.base_type_id
  }
  console.log(`StoneNew.Mount fields: ${JSON.stringify(data, null, 2)}`)
})

const { fields } = storeToRefs(useItemStore())


const data: TStoneFields = reactive({
  id: 0,
  area: "",
  locus: "",
  basket: "",
  stone_no: 0,
  year: null,
  date: "",
  prov_notes: "",
  material_code: "",
  type: "",
  description: "",
  notes: "",
  dimensions: "",
  rim_diameter: null,
  order_column: null,
  material_id: 1,
  base_type_id: 1
})

const rules = computed(() => {
  return {
    id: {},
    area: { required, minLength: minLength(1), maxLength: maxLength(3) },
    locus: { required },
    basket: { required },
    stone_no: { required, numeric, minLength: minLength(1), maxLength: maxLength(99) },
    date: {},
    year: { minValue: minValue(1950), maxValue: maxValue(2025) },
    prov_notes: {},
    type: {},
    material_code: {},
    dimensions: {},
    rim_diameter: {minValue: minValue(1), maxValue: maxValue(99)},
    notes: {},
    description: {},
    material_id: {},
    base_type_id: {}
  }
})

const v$ = useVuelidate(rules, data)

const areaErrors = computed(() => {
  return <string>(v$.value.area.$error ? v$.value.area.$errors[0].$message : undefined)
})

const locusErrors = computed(() => {
  return <string>(v$.value.locus.$error ? v$.value.locus.$errors[0].$message : undefined)
})

const basketErrors = computed(() => {
  return <string>(v$.value.basket.$error ? v$.value.basket.$errors[0].$message : undefined)
})

const stone_noErrors = computed(() => {
  return <string>(v$.value.stone_no.$error ? v$.value.stone_no.$errors[0].$message : undefined)
})

const yearErrors = computed(() => {
  return <string>(v$.value.year.$error ? v$.value.year.$errors[0].$message : undefined)
})
const dateErrors = computed(() => {
  return <string>(v$.value.date.$error ? v$.value.date.$errors[0].$message : undefined)
})

const typeErrors = computed(() => {
  return <string>(v$.value.type.$error ? v$.value.type.$errors[0].$message : undefined)
})

const provErrors = computed(() => {
  return <string>(v$.value.prov_notes.$error ? v$.value.prov_notes.$errors[0].$message : undefined)
})

const descriptionErrors = computed(() => {
  return <string>(v$.value.description.$error ? v$.value.description.$errors[0].$message : undefined)
})

const notesErrors = computed(() => {
  return <string>(v$.value.notes.$error ? v$.value.notes.$errors[0].$message : undefined)
})

const dimensionsErrors = computed(() => {
  return <string>(v$.value.dimensions.$error ? v$.value.dimensions.$errors[0].$message : undefined)
})

const rim_diameterErrors = computed(() => {
  return <string>(v$.value.rim_diameter.$error ? v$.value.rim_diameter.$errors[0].$message : undefined)
})
</script>