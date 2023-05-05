import { ref } from 'vue'
import { defineStore } from 'pinia'
import { TStoneFields } from '@/js/types/moduleFieldsTypes'

export const useStoneStore = defineStore('stone', () => {
  const base: TStoneFields = {
    id: 0,
    area: "XX",
    locus: "",
    basket: "",
    date: "",
    prov_notes: "",
    type: "",
    material: "",
    details: "",
    dimensions: "",
    base_type_id: 0,
    material_id: 0,
  }

  let fields = ref<TStoneFields>(base)

  function tagFromUrlId(url_id: string): string {
    return url_id
  }

  function clear() {
    fields.value = base
  }

  function prepareForNew(isCreate: boolean, current: TStoneFields): void {
    console.log(`stone.prepareForNew() isCreate: ${isCreate}  current${JSON.stringify(current, null, 2)}`)
    if (isCreate) {
      fields.value = base
    } else {
      fields.value = current
    }
  }

  return {
    fields,
    clear,
    tagFromUrlId,
    prepareForNew
  }
})
