import { ref } from 'vue'
import { defineStore } from 'pinia'
import { TStoneFields, TFields } from '@/js/types/moduleFieldsTypes'
import { TStoneSlugParams, TStoneIdParams } from '@/js/types/moduleIdParamsTypes'
import { TParseSlugResponse } from '@/js/types/routesTypes'
export const useStoneStore = defineStore('stone', () => {

  function slugParamsFromSlug(slug: string): TParseSlugResponse {
    let arr = slug.split('.');
    if (arr.length === 1) {
      return {
        success: false, data: {
          error: "BadIdFormat",
          message: "No . detected in slug"
        }
      }
    }
    return {
      success: true, data: {
        basket: arr[0],
        stone_no: arr[1] as unknown as number
      }
    }
  }

  function tagFromUrlId(slug: string): string {
    console.log(`Stone.tagFromUrlId()`)
    return slug
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
    slugParamsFromSlug,
    tagFromUrlId,
  }
})
