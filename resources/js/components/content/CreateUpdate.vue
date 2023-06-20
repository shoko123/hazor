<template>
  <v-container fluid>
    <v-card class="elevation-12">
      <v-card-title id="title" class="grey py-0 mb-4">{{ title }}</v-card-title>
      <v-card-text>
        <component :is="module" :isCreate=props.isCreate>
          <template #data="{ v$, data, id }">
            <v-btn @click="submit(v$, data, id)" variant="outlined">Submit</v-btn>
            <v-btn @click="cancel" variant="outlined" class="ml-1">Cancel</v-btn>
          </template>
        </component>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>

import type { Component } from 'vue'
import type { Validation } from "@vuelidate/core"
import { TApiItemShow, TApiItemUpdate } from '@/js/types/itemTypes'
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
import { useItemStore } from '../../scripts/stores/item'
import { TFields } from '@/js/types/moduleFieldsTypes'
import { useNotificationsStore } from '../../scripts/stores/notifications'
import StoneNew from '../modules/stones/StoneNew.vue'
import FaunaNew from '../modules/fauna/FaunaNew.vue'
import LocusNew from '../modules/loci/LocusNew.vue'
import { useLocusStore } from '../../scripts/stores/modules/locus'
import { useStoneStore } from '../../scripts/stores/modules/stone'
import { useFaunaStore } from '../../scripts/stores/modules/fauna'
let router = useRouter()

let { showSnackbar } = useNotificationsStore()
let { upload } = useItemStore()
const props = defineProps<{
  isCreate: boolean
}>()

let { current } = storeToRefs(useRoutesMainStore())

const title = computed(() => {
  return props.isCreate ? "Create" : "Update"
})

const module = computed<Component>(() => {
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

function beforeStore(isCreate: boolean, fields: TFields ) {
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

const child = ref(null)

async function submit(v$: Validation, data: TFields, id?: number) {
  //console.log(`CreateUpdate.submit() data: ${JSON.stringify(data, null, 2)}`)

  // vuelidate validation
  await v$.$validate();

  if (v$.$error || v$.$silentErrors.length > 0) {
    showSnackbar("Please correct the marked errors!", "orange")
    console.log(`validation errors: ${JSON.stringify(v$.$errors, null, 2)}`)
    console.log(`validation silent errors: ${JSON.stringify(v$.$silentErrors, null, 2)}`)
    return
  }
  
  //alert("Form Successfully Submitted!")
 let fieldsToSend = beforeStore(props.isCreate, data)

 if(fieldsToSend === false){
  alert(`problem with data`)
  return
}

  const itemDetails = await upload(props.isCreate, <TFields>fieldsToSend).catch(err => {
    console.log(`CreateUpdate.upload(error) - return`)
  })

  //console.log(`CreateUpdate.after upload() res: ${JSON.stringify(urlId, null, 2)}`)
  if (props.isCreate) {
    router.push({ name: 'show', params: { module: current.value.url_module, url_id: (<TApiItemShow>itemDetails).url_id} })
  } else {
    router.push({ name: 'show', params: { module: current.value.url_module, url_id: current.value.url_id } })
  }
}

const cancel = () => {
  console.log(`cancel`)
  router.go(-1)
}

</script>
<style scoped>
#title {
  background-color: grey;
}
</style>
