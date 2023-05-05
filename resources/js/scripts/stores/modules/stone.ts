import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { TStoneFields, TStoneFieldsToStore } from '@/js/types/moduleFieldsTypes'

export const useStoneStore = defineStore('stone', () => {

  const base: TStoneFields = {
    id: 0,
    base_type_id: 0,
    material_id: 0,
    area: "XX",
    locus: "",
    basket: "",
    date: "",
    prov_notes: "",
    type: "",
    material: "",
    details: "",
    dimensions: "",
  }

  let all = ref<TStoneFields>(base)

  const storeFields = computed<TStoneFieldsToStore>(() => {
    return {
      area: all.value.area,
      locus: all.value.locus,
      basket: all.value.basket,
      date: all.value.date,
      prov_notes: all.value.prov_notes,
      material: all.value.material,
      type: all.value.type,
      dimensions: all.value.dimensions,
      details: all.value.details
    }
  })

  function tagFromUrlId(url_id: string): string {
    return url_id
  }

  function prepareForNew(isCreate: boolean, current: TStoneFields): void {
    console.log(`stone.prepareForNew() isCreate: ${isCreate}  current${JSON.stringify(current, null, 2)}`)
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
