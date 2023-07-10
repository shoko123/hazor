import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { TFaunaFields, TFields } from '@/js/types/moduleFieldsTypes'
import { TFaunaSlugParams, TFaunaIdParams } from '@/js/types/moduleIdParamsTypes'

export const useFaunaStore = defineStore('fauna', () => {

  function slugToSlugParams(slug: string): TFaunaSlugParams {
    return {
      id: slug as unknown as number,
      locus: "locus",
      basket: 0,
    }
  }

  function tagFromUrlId(url_id: string): string {
    return url_id
  }

  function beforeStore(isCreate: boolean, fields: TFields): TFields | false {
    console.log(`fauna.beforStores() isCreate: ${isCreate}  fields: ${JSON.stringify(fields, null, 2)}`)
        let sf = <TFaunaFields>fields     
    if(isCreate){ 
      let rf = {...sf}
      //do something here
      return rf
    }else {
    return sf
    }
  }
  
  return {
    beforeStore,
    tagFromUrlId,
    slugToSlugParams
  }
})
