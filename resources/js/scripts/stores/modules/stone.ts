import { ref } from 'vue'
import { defineStore } from 'pinia'
import { TStoneFields, TFields } from '@/js/types/moduleFieldsTypes'

export const useStoneStore = defineStore('stone', () => {

  function tagFromUrlId(url_id: string): string {
    console.log(`Stone.tagFromUrlId()`)    
    return url_id
  }

  function beforeStore(isCreate: boolean, fields: TFields): TFields | false {
    console.log(`locus.beforStores() isCreate: ${isCreate}  fields: ${JSON.stringify(fields, null, 2)}`)
        let sf = <TStoneFields>fields     
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
  }
})
