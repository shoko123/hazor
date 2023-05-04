// stores/media.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { TStoneFields, TStoneFieldsToStore } from '@/js/types/moduleFieldsTypes'

export const useStoneStore = defineStore('stone', () => {
  let all = ref<TStoneFields>({
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
  })

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

  function prepareForUpdate(current: TStoneFields): void {
    console.log(`stone.prepareForUpdate:  ${JSON.stringify(current, null, 2)}`)
    all.value = { ...current }
  }

  function prepareForCreate(): void {

  }

  return {
    all,
    storeFields,
    tagFromUrlId,
    prepareForCreate,
    prepareForUpdate
  }
})
