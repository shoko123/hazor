import { ref } from 'vue'
import { defineStore } from 'pinia'
import { TStoneFields, TFields } from '@/js/types/moduleFieldsTypes'
import { TStoneSlugParams, TStoneIdParams } from '@/js/types/moduleIdParamsTypes'
export const useStoneStore = defineStore('stone', () => {

  function slugToSlugParams(slug: string): TStoneSlugParams {
    return {
      id: slug as unknown as number,
      basket: "basket",
      stone_no: 0
    }
  }

  function tagFromUrlId(url_id: string): string {
    console.log(`Stone.tagFromUrlId()`)
    return url_id
  }

  function beforeStore(isCreate: boolean, fields: TFields): TFields | false {
    console.log(`locus.beforStores() isCreate: ${isCreate}  fields: ${JSON.stringify(fields, null, 2)}`)
    let sf = <TStoneFields>fields
    if (isCreate) {
      let rf = { ...sf }
      //do something here
      return rf
    } else {
      return sf
    }
  }
  return {
    beforeStore,
    slugToSlugParams,
    tagFromUrlId,
  }
})
