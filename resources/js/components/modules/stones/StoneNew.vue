<template>
  <v-container fluid class="pa-1 ma-0">
    <v-row wrap no-gutters>
      <v-text-field label="Area" v-model="data.area" :error-messages="areaErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="Locus" v-model="data.locus" :error-messages="locusErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="Basket" v-model="data.basket" :error-messages="basketErrors" class="mr-1" filled>
      </v-text-field>
      <v-text-field label="Date" v-model="data.date" :error-messages="dateErrors" type="date" min="1990-01-01"
        max="2018-12-31"></v-text-field>
    </v-row>

    <v-row wrap no-gutters>
      <v-text-field label="Provenience notes" v-model="data.prov_notes" :error-messages="provErrors" rows="1" class="mr-1"
        auto-grow>
      </v-text-field>
      <v-text-field label="Material" v-model="data.material" class="mr-1" filled> </v-text-field>
      <v-text-field label="Type" v-model="data.type" class="mr-1" filled> </v-text-field>
    </v-row>

    <v-row wrap no-gutters>
      <v-textarea label="Details" v-model="data.details" :error-messages="detailsErrors" rows="1" class="mr-1" auto-grow>
      </v-textarea>
      <v-textarea label="Dimensions" v-model="data.dimensions" :error-messages="dimensionsErrors" rows="1" class="mr-1"
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
import { required, between, minLength, sameAs, maxLength } from "@vuelidate/validators";
import { onMounted, reactive, computed } from "vue";
import { storeToRefs } from 'pinia'
import { TStoneFieldsToStore } from '@/js/types/moduleFieldsTypes'
import { useRouter } from 'vue-router'
import { useItemNewStore } from '../../../scripts/stores/itemNew'
import { useStoneStore } from '../../../scripts/stores/modules/stone'
import { useNotificationsStore } from '../../../scripts/stores/notifications'

const props = defineProps<{
  isCreate: boolean
}>()

onMounted(() => {
  if (!props.isCreate) {
    data.area = fields.value.area
    data.locus = fields.value.locus
    data.basket = fields.value.basket
    data.date = fields.value.date
    data.prov_notes = fields.value.prov_notes
    data.material = fields.value.material
    data.type = fields.value.type
    data.details = fields.value.details
    data.dimensions = fields.value.dimensions
  }
  console.log(`StoneNew.Mount fields: ${JSON.stringify(data, null, 2)}`)
})

let router = useRouter()
let { fields } = storeToRefs(useStoneStore())
let { showSnackbar } = useNotificationsStore()

const data: TStoneFieldsToStore = reactive({
  area: "",
  locus: "",
  basket: "",
  date: "",
  prov_notes: "",
  material: "",
  type: "",
  details: "",
  dimensions: "",
})

const rules = computed(() => {
  return {
    area: { required, minLength: minLength(1), maxLength: maxLength(3) },
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
const v$ = useVuelidate(rules, data);

const areaErrors = computed(() => {
  return <string>(v$.value.area.$error ? v$.value.area.$errors[0].$message : undefined)
})

const locusErrors = computed(() => {
  return <string>(v$.value.locus.$error ? v$.value.locus.$errors[0].$message : undefined)
});

const basketErrors = computed(() => {
  return <string>(v$.value.basket.$error ? v$.value.basket.$errors[0].$message : undefined)
});

const dateErrors = computed(() => {
  return <string>(v$.value.date.$error ? v$.value.date.$errors[0].$message : undefined)
})

const typeErrors = computed(() => {
  return <string>(v$.value.type.$error ? v$.value.type.$errors[0].$message : undefined)
});

const provErrors = computed(() => {
  return <string>(v$.value.prov_notes.$error ? v$.value.prov_notes.$errors[0].$message : undefined)
});

const detailsErrors = computed(() => {
  return <string>(v$.value.details.$error ? v$.value.details.$errors[0].$message : undefined)
});

const dimensionsErrors = computed(() => {
  return <string>(v$.value.dimensions.$error ? v$.value.dimensions.$errors[0].$message : undefined)
});

async function submit() {
  // vuelidate validation
  v$.value.$validate();

  if (v$.value.$error) {
    showSnackbar("Please correct the marked errors!", "orange")
    console.log(`validation errors: ${JSON.stringify(v$.value.$errors, null, 2)}`)
    return
  }

  //alert("Form Successfully Submitted!")
  const store = useItemNewStore()
  const res = await store.upload(props.isCreate, data, fields.value.id)
  if (props.isCreate) {
    //router.push({ name: 'show', params: { module: 'stones', url_id: res.id } })
  } else {
    //router.go(-1)
  }
}

const cancel = () => {
  console.log(`cancel`)
  router.go(-1)
}
</script>