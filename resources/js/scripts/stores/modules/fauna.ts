
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

  let all = ref<TFaunaFields>(base)

  const storeFields = computed<TFaunaFieldsToStore>(() => {
    return {
    label: all.value.label,
    area: all.value.area,
    locus: all.value.locus,
    basket: all.value.basket,
    item_category: all.value.item_category,
    biological_taxonomy: all.value.biological_taxonomy,
    has_taxonomic_identifier: all.value.has_taxonomic_identifier,
    has_anatomical_identifier: all.value.has_anatomical_identifier,
    stratum: all.value.stratum,
    taxon: all.value.taxon,
    element: all.value.element,
    fragment_present: all.value.fragment_present,
    bone_number: all.value.bone_number,
    snippet: all.value.snippet,
    }
  })

  function prepareForNew(isCreate: boolean, current: TFaunaFields): void {
    console.log(`locus.prepareForNew() isCreate: ${isCreate}  current${JSON.stringify(current, null, 2)}`)
    if (isCreate) {
      all.value = { ...base }
    } else {
      all.value = { ...current }
    }
  }

  return {
    all,
    storeFields,
    tagFromUrlId,
    prepareForNew
  }
})
