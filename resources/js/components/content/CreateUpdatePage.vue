<template>
  <v-container fluid>
    <v-card class="elevation-12">
      <v-card-title class="bg-grey text-black py-0 mb-4">
        {{ title }}
      </v-card-title>
      <v-card-text>
        <component
          :is="formNew"
          :is-create="props.isCreate"
        >
          <template #data="{ v, data }">
            <v-btn
              variant="outlined"
              @click="submit(v, data)"
            >
              Submit
            </v-btn>
            <v-btn
              variant="outlined"
              class="ml-1"
              @click="cancel"
            >
              Cancel
            </v-btn>
          </template>
        </component>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>

import { computed, type Component } from 'vue'
import { storeToRefs } from 'pinia'
import { type Validation } from "@vuelidate/core"

import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import { useItemStore } from '../../scripts/stores/item'
import { TGenericFields } from '@/js/types/moduleTypes'
import { useNotificationsStore } from '../../scripts/stores/notifications'
import { useLocusStore } from '../../scripts/stores/modules/locus'
import { useStoneStore } from '../../scripts/stores/modules/stone'
import { useFaunaStore } from '../../scripts/stores/modules/fauna'

import StoneNew from '../modules/stones/StoneNew.vue'
import FaunaNew from '../modules/fauna/FaunaNew.vue'
import LocusNew from '../modules/loci/LocusNew.vue'

const props = defineProps<{
  isCreate: boolean
}>()

let { showSpinner, showSnackbar } = useNotificationsStore()
let { upload } = useItemStore()
let { routerPush } = useRoutesMainStore()
let { current } = storeToRefs(useRoutesMainStore())

const title = computed(() => {
  return props.isCreate ? "Create" : "Update"
})

const formNew = computed<Component>(() => {
  switch (current.value.module) {
    case 'Locus':
      return LocusNew
    case 'Stone':
      return StoneNew
    case 'Fauna':
      return FaunaNew
    default:
      console.log(`Update.vue invalid module`)
      return LocusNew
  }
})

function beforeStore(isCreate: boolean, fields: TGenericFields) {
  let store
  switch (current.value.module) {
    case 'Locus':
      store = useLocusStore()
      break
    case 'Stone':
      store = useStoneStore()
      break
    case 'Fauna':
      store = useFaunaStore()
      break
    default:
      console.log(`Update.vue invalid module`)
      return false
  }
  return store.beforeStore(props.isCreate, fields)
}

async function submit(v: Validation, data: TGenericFields) {
  //console.log(`CreateUpdate.submit() data: ${JSON.stringify(data, null, 2)}`)

  // vuelidate validation
  await v.$validate();

  if (v.$error || v.$silentErrors.length > 0) {
    showSnackbar("Please correct the marked errors!", "orange")
    console.log(`validation errors: ${JSON.stringify(v.$errors, null, 2)}`)
    console.log(`validation silent errors: ${JSON.stringify(v.$silentErrors, null, 2)}`)
    return
  }

  //alert("Form Successfully Submitted!")
  let fieldsToSend = beforeStore(props.isCreate, data)

  if (fieldsToSend === false) {
    alert(`problem with data`)
    return
  }

  showSpinner(`${props.isCreate ? "Creating" : "Updating"} ${current.value.module} item...`)
  const res = await upload(props.isCreate, fieldsToSend)
  showSpinner(false)

  if(!res.success){
    showSnackbar(`Failed to ${props.isCreate ? "create" : "update"} item. ${res.message}`, 'red')
    return
  }

  showSnackbar(`${current.value.module} item ${props.isCreate ? "created" : "updated"} successfully!`)
  console.log(`CreateUpdate. success! res: ${JSON.stringify(res, null, 2)}`)
  
  if (props.isCreate) {
    routerPush('show', res.slug)
  } else {
    routerPush('show', <string>current.value.slug)
  }
}

const cancel = () => {
  console.log(`cancel`)
  routerPush('back1')
}

</script>


