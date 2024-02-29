<template>
  <v-container fluid class="pa-1 ma-0">
    <v-row wrap no-gutters>
      <v-select v-model="data.area" label="Area" :items="areas" />
      <v-text-field
        id="locus"
        v-model="data.locus"
        label="Locus"
        :error-messages="locusErrors"
        class="mr-1"
        filled
      />
      <v-text-field
        id="basket"
        v-model="data.basket"
        label="Basket"
        :error-messages="basketErrors"
        class="mr-1"
        filled
      />
      <v-text-field
        id="stone_no"
        v-model="data.stone_no"
        label="Stone No."
        :error-messages="stone_noErrors"
        class="mr-1"
        filled
      />
      <v-text-field
        id="year"
        v-model="data.year"
        label="Year"
        :error-messages="yearErrors"
        class="mr-1"
        filled
      />
      <v-text-field
        id="date"
        v-model="data.date"
        label="Date"
        :error-messages="dateErrors"
        type="date"
        min="1990-01-01"
        max="2018-12-31"
      />
    </v-row>

    <v-row wrap no-gutters>
      <v-text-field
        v-model="data.type"
        label="Type"
        :error-messages="typeErrors"
        class="mr-1"
        filled
      />
      <v-text-field
        v-model="data.material_code"
        label="Material Code"
        :error-messages="material_codeErrors"
        class="mr-1"
        filled
      />
      <v-text-field
        v-model="data.rim_diameter"
        label="Rim Diameter (mm)"
        :error-messages="rim_diameterErrors"
        class="mr-1"
        filled
      />
    </v-row>

    <v-row wrap no-gutters>
      <v-textarea
        v-model="data.description"
        label="Description"
        :error-messages="descriptionErrors"
        rows="1"
        class="mr-1"
        auto-grow
      />
      <v-textarea
        v-model="data.dimensions"
        label="Dimensions"
        :error-messages="dimensionsErrors"
        rows="1"
        class="mr-1"
        auto-grow
      />
    </v-row>

    <v-row wrap no-gutters>
      <v-textarea
        v-model="data.prov_notes"
        label="Provenience notes"
        :error-messages="provErrors"
        rows="1"
        class="mr-1"
      />
      <v-textarea
        v-model="data.notes"
        label="Notes"
        :error-messages="notesErrors"
        rows="1"
        class="mr-1"
      />
    </v-row>

    <v-row wrap no-gutters>
      <v-textarea
        v-model="data.publication"
        label="Publication(s)"
        :error-messages="publicationErrors"
        rows="1"
        class="mr-1"
      />
    </v-row>
    <slot :id="data.id" name="data" :v="v" :data="data" />
  </v-container>
</template>

<script lang="ts" setup>
import { useTrioStore } from '../../../scripts/stores/trio/trio'
import { TFieldsGeneric } from '@/js/types/moduleTypes'
import { onMounted, reactive, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, maxLength, minValue, maxValue } from '@vuelidate/validators'
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
let { trio, groupLabelToKey } = storeToRefs(useTrioStore())

const data: TFieldsGeneric<'Stone'> = reactive({
  id: 0,
  area: 'A',
  locus: 'Change Me',
  basket: 'Change Me',
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
  base_type_id: 1,
})

const areas = computed(() => {
  let paramKeys = trio.value.groupsObj[groupLabelToKey.value['Area']].paramKeys
  return paramKeys.map((x) => trio.value.paramsObj[x].text)
})

const rules = computed(() => {
  return {
    id: {},
    area: { required }, //no need for validation - from select
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
    base_type_id: { required, minValue: minValue(1), maxValue: maxValue(99) },
  }
})

const v = useVuelidate(rules, data)

const locusErrors = computed(() => {
  return <string>(v.value.locus.$error ? v.value.locus.$errors[0].$message : undefined)
})

const basketErrors = computed(() => {
  return <string>(v.value.basket.$error ? v.value.basket.$errors[0].$message : undefined)
})

const stone_noErrors = computed(() => {
  return <string>(v.value.stone_no.$error ? v.value.stone_no.$errors[0].$message : undefined)
})

const yearErrors = computed(() => {
  return <string>(v.value.year.$error ? v.value.year.$errors[0].$message : undefined)
})
const dateErrors = computed(() => {
  return <string>(v.value.date.$error ? v.value.date.$errors[0].$message : undefined)
})

const typeErrors = computed(() => {
  return <string>(v.value.type.$error ? v.value.type.$errors[0].$message : undefined)
})

const material_codeErrors = computed(() => {
  return <string>(
    (v.value.material_code.$error ? v.value.material_code.$errors[0].$message : undefined)
  )
})
const provErrors = computed(() => {
  return <string>(v.value.prov_notes.$error ? v.value.prov_notes.$errors[0].$message : undefined)
})

const descriptionErrors = computed(() => {
  return <string>(v.value.description.$error ? v.value.description.$errors[0].$message : undefined)
})

const notesErrors = computed(() => {
  return <string>(v.value.notes.$error ? v.value.notes.$errors[0].$message : undefined)
})

const publicationErrors = computed(() => {
  return <string>(v.value.publication.$error ? v.value.publication.$errors[0].$message : undefined)
})

const dimensionsErrors = computed(() => {
  return <string>(v.value.dimensions.$error ? v.value.dimensions.$errors[0].$message : undefined)
})

const rim_diameterErrors = computed(() => {
  return <string>(
    (v.value.rim_diameter.$error ? v.value.rim_diameter.$errors[0].$message : undefined)
  )
})
</script>
