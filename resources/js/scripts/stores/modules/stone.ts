import { computed } from 'vue'
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

  function tagFromSlug(slug: string): string {
    //console.log(`Stone.tagFromSlug()`)
    return slug.replace('.', '/')
  }

  function beforeStore(isCreate: boolean, fields: TFields): TFields | false {
    //console.log(`stone.beforStore() isCreate: ${isCreate}  fields: ${JSON.stringify(fields, null, 2)}`)
    let sf = <TStoneFields>fields
    if (isCreate) {
      let rf = { ...sf }
      //do something here
      return rf
    } else {
      return sf
    }
  }

  const headers = computed(() => {
    return [
      { title: 'Name', align: 'start', key: 'tag', },
      { title: 'Area', align: 'start', key: 'area' },
      { title: 'Locus', align: 'start', key: 'locus' },
      { title: 'Year', align: 'end', key: 'year' },
      { title: 'Type', align: 'start', key: 'type' },
      { title: 'Description', key: 'description',align: 'start',  sortable: false, },
      { title: 'Base Type', align: 'start', key: 'base_type' },
      { title: 'Material Code', align: 'start', key: 'material_code' },
      { title: 'Material', align: 'start', key: 'material' },
      { title: 'Prov Notes', align: 'start', key: 'prove_notes' },
      { title: 'Notes', align: 'start', key: 'notes' },
      { title: 'Publication', align: 'start', key: 'publication' },
      { title: 'Date', align: 'end', key: 'date' },
    ]
  })
 
  return {
    beforeStore,
    slugParamsFromSlug,
    tagFromSlug,
    headers
  }
})
