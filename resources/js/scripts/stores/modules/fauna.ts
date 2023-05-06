
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { TFaunaFields, TFaunaFieldsToStore } from '@/js/types/moduleFieldsTypes'


export const useFaunaStore = defineStore('fauna', () => {
  const id = computed(() => {
    return 4
  })

  function tagFromUrlId(url_id: ""): "" {
    return url_id
  }
  const base: TFaunaFields = {
    id: 0,
    label: "",
    area: "",
    locus: "",
    basket: "",
    item_category: "",
    biological_taxonomy: "",
    has_taxonomic_identifier: "",
    has_anatomical_identifier: "",
    stratum: "",
    taxon: "",
    element: "",
    fragment_present: "",
    bone_number: "",
    snippet: "",
    taxon_id: "",
    element_id: ""
  }

  let fields = ref<TFaunaFields>(base)

  function prepareForNew(isCreate: boolean, current: TFaunaFields): void {
    console.log(`locus.prepareForNew() isCreate: ${isCreate}  current${JSON.stringify(current, null, 2)}`)
    if (isCreate) {
      fields.value = base
    } else {
      fields.value = current 
    }
  }
  
  function clear(){
    fields.value = base
  }
  return {
    fields,
    clear,
    tagFromUrlId,
    prepareForNew
  }
})
