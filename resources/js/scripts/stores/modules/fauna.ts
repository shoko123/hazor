import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { TFaunaFields, TFields } from '@/js/types/moduleFieldsTypes'
import { TFaunaSlugParams, TFaunaIdParams } from '@/js/types/moduleIdParamsTypes'
import { TParseSlugResponse } from '@/js/types/routesTypes'

export const useFaunaStore = defineStore('fauna', () => {

  function slugParamsFromSlug(slug: string): TParseSlugResponse {
    return {
      success: true, data: {
        label: slug as unknown as string,
      }
    }
  }

  function tagFromSlug(slug: string): string {
    return slug
  }

  function beforeStore(isCreate: boolean, fields: TFields): TFields | false {
    console.log(`fauna.beforStores() isCreate: ${isCreate}  fields: ${JSON.stringify(fields, null, 2)}`)
    let sf = <TFaunaFields>fields
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
      { title: 'Tag', align: 'start', key: 'tag', },
      { title: 'Area', align: 'start', key: 'area' },
      { title: 'Locus', align: 'start', key: 'locus' },
      { title: 'Basket', align: 'start', key: 'basket' },
      { title: 'Diagnosic', align: 'start', key: 'diagnostic' },
      { title: 'Registration OK', align: 'start', key: 'registration_clean' },
      { title: 'Base Taxon', align: 'start', key: 'base_taxon' },
      { title: 'Taxon', align: 'start', key: 'taxon' },
      { title: 'Anatomical Label', align: 'start', key: 'anatomical_label' },      
      { title: 'Fragment Present', align: 'start', key: 'fragment_present' },
      { title: 'Base Element', align: 'start', key: 'base_element' },
      { title: 'Symmetry', align: 'start', key: 'symmetry' },
      { title: 'Modifications', align: 'start', key: 'modifications' },
    ]
  })

  return {
    beforeStore,
    tagFromSlug,
    slugParamsFromSlug,
    headers
  }
})
