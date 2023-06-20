import { defineStore } from 'pinia'
import { TLocusFields, TFields } from '@/js/types/moduleFieldsTypes'

export const useLocusStore = defineStore('locus', () => {
  const reNameIsLocusNo = /^\d{1,5}$/
  const reNameIsLocusNoWithAddendum = /^\d{+}[a-c]$/
  const reNameIsYearHyphenLocusNo = /^\d{2}-\d{3}$/
  const reNameIsYearAreaHyphenLocusNo = /^\d{2}[A-Z]\d{1}-\d{3}$/
  
  function tagFromUrlId(url_id: string): string {
    return url_id
  }

  function beforeStore(isCreate: boolean, fields: TFields): TFields | false {
    console.log(`locus.beforStores() isCreate: ${isCreate}  fields: ${JSON.stringify(fields, null, 2)}`)
    let lf = <TLocusFields>fields
    if (isCreate) {
      let rf = { ...lf }
      if (reNameIsLocusNo) {
        rf.locus_no = lf.name as unknown as number
      }
      return rf
    } else {
      return lf
    }
  }

  return {
    beforeStore,
    tagFromUrlId,
  }
})