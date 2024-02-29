<template>
  <v-container
    fluid
    class="pa-1 ma-0"
  >
    <v-row
      wrap
      no-gutters
    >
      <v-text-field
        v-model="data.name"
        label="Name"
        :error-messages="nameErrors"
        class="mr-1"
        filled
      />
      <v-select
        v-model="data.area"
        label="Area"
        :items="areas"
      />
      <v-text-field
        v-model="data.square"
        label="Square"
        :error-messages="squareErrors"
        class="mr-1"
        filled
      />
      <v-text-field
        v-model="data.stratum"
        label="stratum"
        :error-messages="stratumErrors"
        class="mr-1"
        filled
      />
    </v-row>

    <v-row
      wrap
      no-gutters
    >
      <v-text-field
        v-model="data.type"
        label="Type"
        :error-messages="typeErrors"
        class="mr-1"
        filled
      />
      <v-text-field
        v-model="data.cross_ref"
        label="cross_ref"
        :error-messages="cross_refErrors"
        class="mr-1"
        filled
      />
      <v-text-field
        v-model="data.elevation"
        label="Elevation"
        :error-messages="elevationErrors"
        class="mr-1"
        filled
      />
    </v-row>

    <v-row
      wrap
      no-gutters
    >
      <v-textarea
        v-model="data.description"
        label="Description"
        class="mr-1"
        :error-messages="descriptionErrors"
        filled
      />
      <v-textarea
        v-model="data.notes"
        label="Notes"
        class="mr-1"
        :error-messages="notesErrors"
        filled
      />
    </v-row>
    <slot
      :id="data.id"
      name="data"
      :v="v"
      :data="data"
    />
  </v-container>
</template>

<script lang="ts" setup>

import { onMounted, reactive, computed } from 'vue'
import { storeToRefs } from 'pinia'
import type { TFieldsGeneric } from '@/js/types/moduleTypes'
import { useVuelidate } from "@vuelidate/core"
import { required, minValue, maxValue, maxLength, helpers } from "@vuelidate/validators";
import { useItemStore } from '../../../scripts/stores/item'
import { useTrioStore } from '../../../scripts/stores/trio/trio2'

const props = defineProps<{
  isCreate: boolean
}>()

onMounted(() => {
  if (!props.isCreate) {
    Object.assign(data, fields.value)
  }
  console.log(`LocusNew isCreate: ${props.isCreate}\n data: ${JSON.stringify(data, null, 2)}`)
})

const { fields } = storeToRefs(useItemStore())
const { trio, groupLabelToKey } = storeToRefs(useTrioStore())

let data: TFieldsGeneric<'Locus'> = reactive({
  id: 0,
  name: "",
  area: "XX",
  locus_no: 0,
  addendum: null,
  year: null,
  square: "",
  stratum: "",
  type: "",
  cross_ref: "",
  description: "",
  notes: "",
  elevation: "",
})

// const nameIsLocusNo = helpers.regex(/^\d{1,5}$/)
// const nameIsLocusNoWithAddendum = helpers.regex(/^\d{+}[a-c]$/)
// const nameIsYearHyphenLocusNo = helpers.regex(/^\d{2}-\d{3}$/)
// const nameIsYearAreaHyphenLocusNo = helpers.regex(/^\d{2}[A-Z]\d{1}-\d{3}$/)
// allowed names int(1-5 digits), int with 1-2 chars addendum, year(2-digits)-locusNo(3-digits), year+area-locusNo
const nameValidator = helpers.regex(/^\d{1,5}$|^\d{1,5}[a-c]$|^\d{2}-\d{3}$|^\d{2}[A-Z]\d{1}-\d{3}$/)

const areas = computed(() => {
  let paramKeys = trio.value.groupsObj[groupLabelToKey.value['Area']].paramKeys
  return paramKeys.map(x => trio.value.paramsObj[x].text)
})

const rules = computed(() => {
  return {
    id: {},
    name: { nameIsLocusNo: helpers.withMessage('Incorrect name pattern', nameValidator) },
    area: { required },//from select list
    //locus_no: value filled in beforeStore
    //addendum:  value filled in beforeStore
    year: { minValue: minValue(1950), maxValue: maxValue(2025) },
    square: { maxLength: maxLength(10) },
    stratum: { maxLength: maxLength(15) },
    type: { maxLength: maxLength(30) },
    cross_ref: { maxLength: maxLength(130) },
    description: { maxLength: maxLength(500) },
    notes: { maxLength: maxLength(200) },
    elevation: { maxLength: maxLength(20) },
  }
})

const v = useVuelidate(rules, data)

const nameErrors = computed(() => {
  return <string>(v.value.name.$error ? v.value.name.$errors[0].$message : undefined)
})

// const locus_noErrors = computed(() => {
//   return <string>(v.value.locus_no.$error ? v.value.locus_no.$errors[0].$message : undefined)
// })

const squareErrors = computed(() => {
  return <string>(v.value.square.$error ? v.value.square.$errors[0].$message : undefined)
})

const stratumErrors = computed(() => {
  return <string>(v.value.stratum.$error ? v.value.stratum.$errors[0].$message : undefined)
})

const typeErrors = computed(() => {
  return <string>(v.value.type.$error ? v.value.type.$errors[0].$message : undefined)
})

const cross_refErrors = computed(() => {
  return <string>(v.value.cross_ref.$error ? v.value.cross_ref.$errors[0].$message : undefined)
})

const descriptionErrors = computed(() => {
  return <string>(v.value.description.$error ? v.value.description.$errors[0].$message : undefined)
})

const notesErrors = computed(() => {
  return <string>(v.value.notes.$error ? v.value.notes.$errors[0].$message : undefined)
})

const elevationErrors = computed(() => {
  return <string>(v.value.elevation.$error ? v.value.elevation.$errors[0].$message : undefined)
})
</script>