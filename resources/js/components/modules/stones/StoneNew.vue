<template>
  <v-container fluid class="pa-1 ma-0">

    <v-row wrap no-gutters>
      <v-text-field label="Area" v-model="area" :error-messages="areaErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="Locus" v-model="locus" :error-messages="locusErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="Basket" v-model="basket" :error-messages="basketErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="Date" v-model="date" :error-messages="dateErrors" type="date" min="1990-01-01"
        max="2018-12-31"></v-text-field>
    </v-row>

    <v-row wrap no-gutters>
      <v-text-field label="Provenience notes" v-model="prov_notes" :error-messages="provErrors" rows="1" class="mr-1"
        auto-grow>
      </v-text-field>
      <v-text-field label="Material" v-model="material" class="mr-1" filled> </v-text-field>
      <v-text-field label="Type" v-model="type" class="mr-1" filled> </v-text-field>
    </v-row>

    <v-row wrap no-gutters>
      <v-textarea label="Details" v-model="details" :error-messages="detailsErrors" rows="1" class="mr-1" auto-grow>
      </v-textarea>
      <v-textarea label="Dimensions" v-model="dimensions" :error-messages="dimensionsErrors" rows="1" class="mr-1"
        auto-grow></v-textarea>
    </v-row>
    <v-row>
      <v-btn @click="submit" variant="outlined">Submit</v-btn>
      <v-btn @click="cancel" variant="outlined">Cancel</v-btn>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useVuelidate } from "@vuelidate/core";
import { required, between, minLength, sameAs } from "@vuelidate/validators";
import { ref, reactive, computed } from "vue";
import { storeToRefs } from 'pinia'
import { TStoneFields, TStoneFieldsToStore } from '@/js/types/moduleFieldsTypes'
import { useRouter } from 'vue-router'
import { useItemNewStore } from '../../../scripts/stores/itemNew'
import { useStoneStore } from '../../../scripts/stores/modules/stone'

const props = defineProps<{
  isCreate: boolean
}>()


let router = useRouter()
let { storeFields, all } = storeToRefs(useStoneStore())

const rules = computed(() => {
  return {
    area: { required },
    locus: { required },
    basket: { required },
    date: {},
    prov_notes: {},
    material: {},
    type: {},
    details: {},
    dimensions: {},
  }
})
const v$ = useVuelidate(rules, all.value);

const area = computed({
  get: () => { return storeFields.value.area },
  set: val => { all.value.area = val }
})

const locus = computed({
  get: () => { return storeFields.value.locus },
  set: val => { all.value.locus = val }
})

const basket = computed({
  get: () => { return storeFields.value.basket },
  set: val => { all.value.basket = val }
})

const date = computed({
  get: () => { return storeFields.value.date },
  set: val => { all.value.date = val }
})

const prov_notes = computed({
  get: () => { return storeFields.value.prov_notes },
  set: val => { all.value.prov_notes = val }
})

const material = computed({
  get: () => { return storeFields.value.material },
  set: val => { all.value.material = val }
})

const type = computed({
  get: () => { return storeFields.value.type },
  set: val => { all.value.type = val }
})

const details = computed({
  get: () => { return storeFields.value.details },
  set: val => { all.value.details = val }
})

const dimensions = computed({
  get: () => { return storeFields.value.dimensions },
  set: val => { all.value.dimensions = val }
})


const areaErrors = computed(() => {
  return <string[]>v$.value.area.$errors.map(x => x.$message)
})

const locusErrors = computed(() => {
  return <string[]>v$.value.locus.$errors.map(x => x.$message)
});

const basketErrors = computed(() => {
  return <string[]>v$.value.basket.$errors.map(x => x.$message)
});

const dateErrors = computed(() => {
  return <string[]>v$.value.date.$errors.map(x => x.$message)
})

const typeErrors = computed(() => {
  return <string[]>v$.value.type.$errors.map(x => x.$message)
});

const provErrors = computed(() => {
  return <string[]>v$.value.prov_notes.$errors.map(x => x.$message)
});

const detailsErrors = computed(() => {
  return <string[]>v$.value.details.$errors.map(x => x.$message)
});

const dimensionsErrors = computed(() => {
  return <string[]>v$.value.dimensions.$errors.map(x => x.$message)
});

async function submit() {
  // vuelidate validation
  v$.value.$validate();

  if (v$.value.$error) {
    console.log(`validation errors: ${JSON.stringify(v$.value.$errors, null, 2)}`)
    return
  }

  //alert("Form Successfully Submitted!")
  const store = useItemNewStore()
  const res = await store.upload(props.isCreate, storeFields.value, all.value.id)
  if (props.isCreate) {
    router.push({ name: 'show', params: { module: 'stones', url_id: res.id } })
  } else {
    router.go(-1)
  }
}

const cancel = () => {
  console.log(`cancel`)
  router.go(-1)
}
</script>