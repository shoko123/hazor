<template>
  <v-container fluid class="pa-1 ma-0">

    <v-row wrap no-gutters>
      <v-text-field label="Area" v-model="data.area" :error-messages="areaErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="Name" v-model="data.name" :error-messages="nameErrors" class="mr-1" filled> </v-text-field>
      <v-text-field label="Square" v-model="data.square" :error-messages="squareErrors" class="mr-1" filled>
      </v-text-field>
      <v-text-field label="Elevation" v-model="data.elevation" :error-messages="elevationErrors" class="mr-1"
        filled></v-text-field>
    </v-row>

    <v-row wrap no-gutters>
      <v-text-field label="Type" v-model="data.type" :error-messages="typeErrors" class="mr-1" filled>
      </v-text-field>
      <v-text-field label="stratum" v-model="data.stratum" :error-messages="stratumErrors" class="mr-1" filled>
      </v-text-field>
      <v-text-field label="cross_ref" v-model="data.cross_ref" :error-messages="cross_refErrors" class="mr-1" filled>
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
import { required, between, minLength, sameAs, maxLength } from "@vuelidate/validators";
import { onMounted, reactive, computed } from "vue";
import { storeToRefs } from 'pinia'
import { TLocusFieldsToStore } from '@/js/types/moduleFieldsTypes'
import { useRouter } from 'vue-router'
import { useItemNewStore } from '../../../scripts/stores/itemNew'
import { useLocusStore } from '../../../scripts/stores/modules/locus'
import { useNotificationsStore } from '../../../scripts/stores/notifications'

const props = defineProps<{
  isCreate: boolean
}>()

onMounted(() => {
  if (!props.isCreate) {
    data.area = fields.value.area
    data.name = fields.value.name
    data.square = fields.value.square
    data.elevation = fields.value.elevation
    data.type = fields.value.type
    data.stratum = fields.value.stratum
    data.cross_ref = fields.value.cross_ref
  }
  console.log(`LocusNew.Mount fields: ${JSON.stringify(data, null, 2)}`)
})

let router = useRouter()
let { fields } = storeToRefs(useLocusStore())
let { showSnackbar } = useNotificationsStore()

const data: TLocusFieldsToStore = reactive({
  area: "",
  name: "",
  square: "",
  elevation: "",
  type: "",
  stratum: "",
  cross_ref: "",
})

const rules = computed(() => {
  return {
    area: { required, minLength: minLength(2), maxLength: maxLength(2) },
    name: { required },
    square: {},
    elevation: {},
    type: {},
    stratum: {},
    cross_ref: {},
  }
})

const v$ = useVuelidate(rules, data)

const areaErrors = computed(() => {
  return <string>(v$.value.area.$error ? v$.value.area.$errors[0].$message : undefined)
})

const nameErrors = computed(() => {
  return <string>(v$.value.name.$error ? v$.value.name.$errors[0].$message : undefined)
})

const squareErrors = computed(() => {
  return <string>(v$.value.square.$error ? v$.value.square.$errors[0].$message : undefined)
})

const elevationErrors = computed(() => {
  return <string>(v$.value.elevation.$error ? v$.value.elevation.$errors[0].$message : undefined)
})

const typeErrors = computed(() => {
  return <string>(v$.value.type.$error ? v$.value.type.$errors[0].$message : undefined)
})

const stratumErrors = computed(() => {
  return <string>(v$.value.stratum.$error ? v$.value.stratum.$errors[0].$message : undefined)
})

const cross_refErrors = computed(() => {
  return <string>(v$.value.cross_ref.$error ? v$.value.cross_ref.$errors[0].$message : undefined)
})

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
    router.push({ name: 'show', params: { module: 'loci', url_id: res.id } })
  } else {
    router.go(-1)
  }
}

const cancel = () => {
  console.log(`cancel`)
  router.go(-1)
}
</script>