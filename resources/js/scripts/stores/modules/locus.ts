import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { TLocusFields, TLocusFieldsToStore } from '@/js/types/moduleFieldsTypes'

export const useLocusStore = defineStore('locus', () => {
  const base: TLocusFields = {
    id: 0,
    area: "",
    name: "",
    square: "",
    elevation: "",
    type: "",
    stratum: "",
    cross_ref: "",
  }

  let all = ref<TLocusFields>(base)

  const storeFields = computed<TLocusFieldsToStore>(() => {
    return {
      area: all.value.area,
      name: all.value.name,
      square: all.value.square,
      elevation: all.value.elevation,
      type: all.value.type,
      stratum: all.value.stratum,
      cross_ref: all.value.cross_ref,
    }
  })

  function tagFromUrlId(url_id: string): string {
    return url_id
  }

  function prepareForNew(isCreate: boolean, current: TLocusFields): void {
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