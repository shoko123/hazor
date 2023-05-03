<template>
  <v-container fluid class="pa-1 ma-0">

    <v-row wrap no-gutters>
      <v-text-field label="Area" v-model="ns.area" :error-messages="areaErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="Locus" v-model="ns.locus" :error-messages="locusErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="Basket" v-model="ns.basket" :error-messages="basketErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="Date" v-model="ns.date" :error-messages="dateErrors" type="date" min="1990-01-01" max="2018-12-31"></v-text-field>
    </v-row>

    <v-row wrap no-gutters>
      <v-textarea label="Prove notes" v-model="ns.prov_notes" :error-messages="provErrors" rows="1" class="mr-1" auto-grow>
      </v-textarea>
      <v-textarea label="Details" v-model="ns.details" :error-messages="detailsErrors" rows="1" class="mr-1" auto-grow>
      </v-textarea>
      <v-textarea label="Dimensions" v-model="ns.dimensions" :error-messages="dimensionsErrors" rows="1" class="mr-1"
        auto-grow></v-textarea>
    </v-row>

    <v-row wrap no-gutters>
      <v-text-field label="Type" v-model="ns.type" class="mr-1" filled> </v-text-field>
      <v-text-field label="Material" v-model="ns.material" class="mr-1" filled> </v-text-field>
      <v-text-field label="Notes" v-model="ns.prov_notes" class="mr-1" filled></v-text-field>
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
import { TStoneFields } from '@/js/types/moduleFieldsTypes'
import { useRouter } from 'vue-router'

let router = useRouter()
let ns = reactive<TStoneFields>({
  id: 0,
  material_id: 1,
  base_type_id: 1,
  type: "",
  area: "XX",
  date: "",
  basket: "",
  locus: "",
  prov_notes: "",
  material: "",
  dimensions: "",
  details: ""
})


const rules = computed(() => {
  return {
    id: { required, between: between(1, 100000) },
    material_id: { required },
    base_type_id: { required },
    type: { required },
    area: { required },
    date: {  },
    basket: { required },
    locus: { required, between: between(1, 3) },
    prov_notes: { required },
    material: { required },
    dimensions: { required },
    details: { required },
  }
})
const v$ = useVuelidate(rules, ns);

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

const submit = () => {
  // vuelidate validation
  v$.value.$validate();


  // if success
  if (!v$.value.$error) {
    alert("Form Successfully Submitted!");
  } else {
    console.log(`validation errors: ${JSON.stringify(v$.value.$errors, null, 2)}`)
  }
};

const cancel = () => {
  console.log(`cancel`)
  router.go(-1)
}
</script>