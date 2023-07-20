<template>
  <v-container fluid class="pa-1 ma-0">
    <v-row wrap no-gutters>
      <v-select label="Area" v-model="data.area" :items="areas"></v-select>
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
      <v-text-field label="Material Code" v-model="data.material_code" :error-messages="material_codeErrors" class="mr-1"
        filled>
      </v-text-field>
      <v-text-field label="Rim Diameter (mm)" v-model="data.rim_diameter" :error-messages="rim_diameterErrors" class="mr-1"
        filled> </v-text-field>
    </v-row>

    <v-row wrap no-gutters>
      <v-textarea label="Description" v-model="data.description" :error-messages="descriptionErrors" rows="1" class="mr-1"
        auto-grow>
      </v-textarea>
      <v-textarea label="Dimensions" v-model="data.dimensions" :error-messages="dimensionsErrors" rows="1" class="mr-1"
        auto-grow></v-textarea>
    </v-row>

    <v-row wrap no-gutters>
      <v-textarea label="Provenience notes" v-model="data.prov_notes" :error-messages="provErrors" rows="1"
        class="mr-1"></v-textarea>
      <v-textarea label="Notes" v-model="data.notes" :error-messages="notesErrors" rows="1" class="mr-1"></v-textarea>
    </v-row>

    <v-row wrap no-gutters>
      <v-textarea label="Publication(s)" v-model="data.publication" :error-messages="publicationErrors" rows="1"
        class="mr-1"></v-textarea>
    </v-row>
    <slot name="data" v-bind:v$=v$ v-bind:data=data v-bind:id=data.id></slot>
  </v-container>
</template>

<script lang="ts" setup>
import { useTrioStore } from '../../../scripts/stores/trio/trio'
import { TStoneFields } from '@/js/types/moduleFieldsTypes'
import { onMounted, reactive, computed, ref } from "vue"
import { storeToRefs } from 'pinia'
import { useVuelidate } from "@vuelidate/core"
import { required, numeric, minLength, maxLength, minValue, maxValue } from "@vuelidate/validators"
import { useItemStore } from '../../../scripts/stores/item'


const props = defineProps<{
  isCreate: boolean
}>()

onMounted(() => {
  if (!props.isCreate) {
    Object.assign(data, fields.value)
  }
  //console.log(`StoneNew.Mount fields: ${JSON.stringify(data, null, 2)}`)
})

const { fields } = storeToRefs(useItemStore())
let { trio } = storeToRefs(useTrioStore())

const data: TStoneFields = reactive({
  id: 0,
  area: "A",
  locus: "Change Me",
  basket: "Change Me",
  stone_no: 0,
  year: null,
  date: null,
  prov_notes: null,
  material_code: null,
  type: null,
  description: null,
  notes: null,
  publication: null,
  dimensions: null,
  rim_diameter: null,
  order_column: null,
  material_id: 1,
  base_type_id: 1
})

const areas = computed(() => {
  return trio.value.entities.groups["Area"].params.map(x => trio.value.entities.params[x].name)
})

const rules = computed(() => {
  return {
    id: {},
    area: { required },//no need for validation - from select 
    locus: { required, maxLength: maxLength(50) },
    basket: { required, maxLength: maxLength(50) },
    stone_no: { required, numeric, minValue: minValue(0), maxValue: maxValue(99) },
    date: { maxLength: maxLength(50) },
    year: { minValue: minValue(1950), maxValue: maxValue(2025) },
    prov_notes: { maxLength: maxLength(200) },
    type: { maxLength: maxLength(50) },
    material_code: { maxLength: maxLength(20) },
    dimensions: { maxLength: maxLength(250) },
    rim_diameter: { minValue: minValue(1), maxValue: maxValue(500) },
    notes: { maxLength: maxLength(250) },
    description: { maxLength: maxLength(500) },
    publication: { maxLength: maxLength(250) },
    material_id: { required, minValue: minValue(1), maxValue: maxValue(200) },
    base_type_id: { required, minValue: minValue(1), maxValue: maxValue(99) }
  }
})

const v$ = useVuelidate(rules, data)

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

const material_codeErrors = computed(() => {
  return <string>(v$.value.material_code.$error ? v$.value.material_code.$errors[0].$message : undefined)
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

const publicationErrors = computed(() => {
  return <string>(v$.value.publication.$error ? v$.value.publication.$errors[0].$message : undefined)
})

const dimensionsErrors = computed(() => {
  return <string>(v$.value.dimensions.$error ? v$.value.dimensions.$errors[0].$message : undefined)
})

const rim_diameterErrors = computed(() => {
  return <string>(v$.value.rim_diameter.$error ? v$.value.rim_diameter.$errors[0].$message : undefined)
})
</script>