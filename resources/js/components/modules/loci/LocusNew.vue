<template>
  <v-container fluid class="pa-1 ma-0">

    <v-row wrap no-gutters>
      <v-text-field label="Area" v-model="area" :error-messages="areaErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="Name" v-model="name" :error-messages="nameErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="Square" v-model="square" :error-messages="squareErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="Elevation" v-model="elevation" :error-messages="elevationErrors" class="mr-1"
        filled></v-text-field>
    </v-row>

    <v-row wrap no-gutters>
      <v-text-field label="Type" v-model="type" :error-messages="typeErrors" class="mr-1" filled>
      </v-text-field>
      <v-text-field label="stratum" v-model="stratum" :error-messages="stratumErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="cross_ref" v-model="cross_ref" :error-messages="cross_refErrors" class="mr-1" filled>
      </v-text-field>
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
import { useLocusStore } from '../../../scripts/stores/modules/locus'

const props = defineProps<{
  isCreate: boolean
}>()

let router = useRouter()
let { storeFields, all } = storeToRefs(useLocusStore())

const rules = computed(() => {
  return {
    area: {},
    name: {},
    square: {},
    elevation: {},
    type: {},
    stratum: {},
    cross_ref: {},
  }
})
const v$ = useVuelidate(rules, storeFields.value);

const area = computed({
  get: () => { return storeFields.value.area },
  set: val => { all.value.area = val }
})

const name = computed({
  get: () => { return storeFields.value.name },
  set: val => { all.value.name = val }
})

const square = computed({
  get: () => { return storeFields.value.square },
  set: val => { all.value.square = val }
})

const elevation = computed({
  get: () => { return storeFields.value.elevation },
  set: val => { all.value.elevation = val }
})

const type = computed({
  get: () => { return storeFields.value.type },
  set: val => { all.value.type = val }
})

const stratum = computed({
  get: () => { return storeFields.value.stratum },
  set: val => { all.value.stratum = val }
})

const cross_ref = computed({
  get: () => { return storeFields.value.cross_ref },
  set: val => { all.value.cross_ref = val }
})



const areaErrors = computed(() => {
  return <string[]>v$.value.area.$errors.map(x => x.$message)
})

const nameErrors = computed(() => {
  return <string[]>v$.value.name.$errors.map(x => x.$message)
});

const squareErrors = computed(() => {
  return <string[]>v$.value.square.$errors.map(x => x.$message)
});

const elevationErrors = computed(() => {
  return <string[]>v$.value.elevation.$errors.map(x => x.$message)
})

const typeErrors = computed(() => {
  return <string[]>v$.value.type.$errors.map(x => x.$message)
});

const stratumErrors = computed(() => {
  return <string[]>v$.value.stratum.$errors.map(x => x.$message)
});

const cross_refErrors = computed(() => {
  return <string[]>v$.value.cross_ref.$errors.map(x => x.$message)
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