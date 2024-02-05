import { computed } from 'vue'
import { defineStore } from 'pinia'
import { TFaunaFields, TGenericFields, TFuncValidateSlug } from '@/js/types/moduleTypes'

export const useFaunaStore = defineStore('fauna', () => {

  const validateSlug: TFuncValidateSlug = function(slug: string) { 
    return {
      success: true,
      data: { label: slug },
      message: ''
    }
  }

  function tagFromSlug(slug: string): string {
    return slug
  }

  function beforeStore(isCreate: boolean, fields: TGenericFields): TGenericFields | false {
    console.log(`fauna.beforStores() isCreate: ${isCreate}  fields: ${JSON.stringify(fields, null, 2)}`)
    const sf = <TFaunaFields>fields
    if (isCreate) {
      const rf = { ...sf }
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
      { title: 'Registration Clean', align: 'start', key: 'registration_clean' },
      { title: 'taxon', align: 'start', key: 'taxon' },
      { title: 'Common Name', align: 'start', key: 'taxon_common_name' },
      { title: 'Fragment Present', align: 'start', key: 'fragment_present' },
      { title: 'Anatomical Label', align: 'start', key: 'anatomical_label' },
      { title: 'Element', align: 'start', key: 'element' },
      { title: 'Modifications', align: 'start', key: 'modifications' },
      { title: 'Symmetry', align: 'start', key: 'symmetry' },
      { title: 'Phase', align: 'start', key: 'phase' },
      { title: 'Age', align: 'start', key: 'age' },
    ]
  })


  return {
    beforeStore,
    tagFromSlug,
    validateSlug,
    headers
  }
})
