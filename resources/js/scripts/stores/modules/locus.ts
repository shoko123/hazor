import { ref } from 'vue'
import { defineStore } from 'pinia'
import { TLocusFields, TFields} from '@/js/types/moduleFieldsTypes'

export const useLocusStore = defineStore('locus', () => {
  const base: TLocusFields = {
    id: 0,
    area: "XX",
    name: "",
    square: "",
    elevation: "",
    type: "",
    stratum: "",
    cross_ref: "",
  }

  let fields = ref<TLocusFields>(base)

  function tagFromUrlId(url_id: string): string {
    return url_id
  }

  function prepareForNew(isCreate: boolean, current: TFields): void {
    console.log(`locus.prepareForNew() isCreate: ${isCreate}  current${JSON.stringify(current, null, 2)}`)
    if (isCreate) {
      fields.value = base
    } else {
      fields.value = <TLocusFields>current
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