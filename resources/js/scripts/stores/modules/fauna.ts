import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { TFaunaFields, TFields } from '@/js/types/moduleFieldsTypes'
import { TFaunaSlugParams, TFaunaIdParams } from '@/js/types/moduleIdParamsTypes'
import { TParseSlugResponse } from '@/js/types/routesTypes'

export const useFaunaStore = defineStore('fauna', () => {

  function slugParamsFromSlug(slug: string): TParseSlugResponse {
    return {
      success: true, data: {
        id: slug as unknown as number
      }
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
    slugParamsFromSlug
  }
})
