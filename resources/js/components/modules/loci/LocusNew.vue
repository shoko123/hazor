<template>
  <v-container fluid class="pa-1 ma-0">
    <v-row wrap no-gutters>
      <v-text-field label="Name" v-model="data.name" :error-messages="nameErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="Area" v-model="data.area" :error-messages="areaErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="Square" v-model="data.square" :error-messages="squareErrors" class="mr-1" filled>
      </v-text-field>
      <v-text-field label="stratum" v-model="data.stratum" :error-messages="stratumErrors" class="mr-1" filled>
      </v-text-field>
    </v-row>

    <v-row wrap no-gutters>
      <v-text-field label="Type" v-model="data.type" :error-messages="typeErrors" class="mr-1" filled>
      </v-text-field>
      <v-text-field label="cross_ref" v-model="data.cross_ref" :error-messages="cross_refErrors" class="mr-1" filled>
      </v-text-field>
      <v-text-field label="Elevation" v-model="data.elevation" :error-messages="elevationErrors" class="mr-1"
        filled></v-text-field>
    </v-row>

    <v-row wrap no-gutters>
      <v-textarea label="Description" v-model="data.description" class="mr-1" :error-messages="descriptionErrors" filled> </v-textarea>
      <v-textarea label="Notes" v-model="data.notes" class="mr-1" :error-messages="notesErrors" filled> </v-textarea>
    </v-row>
    <slot name="data" v-bind:v$=v$ v-bind:data=data v-bind:id=fields.id></slot>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, reactive, computed } from "vue";
import { storeToRefs } from 'pinia'
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
import { TLocusFieldsToStore } from '@/js/types/moduleFieldsTypes'
import { useLocusStore } from '../../../scripts/stores/modules/locus'

onMounted(() => {
  data.name = fields.value.name
  data.area = fields.value.area
  data.square = fields.value.square
  data.stratum = fields.value.stratum
  data.type = fields.value.type
  data.cross_ref = fields.value.cross_ref
  data.description = fields.value.description
  data.notes = fields.value.notes
  data.elevation = fields.value.elevation

  console.log(`LocusNew.Mount fields: ${JSON.stringify(data, null, 2)}`)
})

let { fields } = storeToRefs(useLocusStore())

const data: TLocusFieldsToStore = reactive({
  name: "",
  area: "",
  square: "",
  stratum: "",
  type: "",
  cross_ref: "",
  description: "",
  notes: "",
  elevation: "",
})

const rules = computed(() => {
  return {
    name: { required },
    area: { required, minLength: minLength(2), maxLength: maxLength(2) },
    square: {},
    stratum: {},
    type: {},
    cross_ref: {},
    description: { maxLength: maxLength(500) },
    notes: { maxLength: maxLength(200) },
    elevation: {},
  }
})

const v$ = useVuelidate(rules, data)

const nameErrors = computed(() => {
  return <string>(v$.value.name.$error ? v$.value.name.$errors[0].$message : undefined)
})

const areaErrors = computed(() => {
  return <string>(v$.value.area.$error ? v$.value.area.$errors[0].$message : undefined)
})

const squareErrors = computed(() => {
  return <string>(v$.value.square.$error ? v$.value.square.$errors[0].$message : undefined)
})

const stratumErrors = computed(() => {
  return <string>(v$.value.stratum.$error ? v$.value.stratum.$errors[0].$message : undefined)
})

const typeErrors = computed(() => {
  return <string>(v$.value.type.$error ? v$.value.type.$errors[0].$message : undefined)
})

const cross_refErrors = computed(() => {
  return <string>(v$.value.cross_ref.$error ? v$.value.cross_ref.$errors[0].$message : undefined)
})

const descriptionErrors = computed(() => {
  return <string>(v$.value.description.$error ? v$.value.description.$errors[0].$message : undefined)
})

const notesErrors = computed(() => {
  return <string>(v$.value.notes.$error ? v$.value.notes.$errors[0].$message : undefined)
})

const elevationErrors = computed(() => {
  return <string>(v$.value.elevation.$error ? v$.value.elevation.$errors[0].$message : undefined)
})



</script>