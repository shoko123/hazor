import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { TFaunaFields, TFields } from '@/js/types/moduleFieldsTypes'
import { TFaunaSlugParams, TFaunaIdParams } from '@/js/types/moduleIdParamsTypes'
import { TParseSlugResponse } from '@/js/types/routesTypes'

export const useFaunaStore = defineStore('fauna', () => {

  function slugParamsFromSlug(slug: string): TParseSlugResponse {

    function isPositiveInteger(str: string) {
      const number = Number(str);
      const isInteger = Number.isInteger(number);
      const isPositive = number > 0;

      return isInteger && isPositive;
    }

    if (!isPositiveInteger(slug)) {
      return {
        success: false, data: {
          error: "BadIdFormat",
          message: "Slug is not a positive integer"
        }
      }
    }

    return {
      success: true, data: {
        label: slug as unknown as number,
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
      { title: 'Label', align: 'end', key: 'tag', },
      { title: 'Area', align: 'start', key: 'area' },
      { title: 'Locus', align: 'start', key: 'locus' },
      { title: 'Basket', align: 'start', key: 'basket' },
      { title: 'Notes', align: 'start', key: 'notes' },
      { title: 'Category', align: 'start', key: 'item_category' },
      { title: 'Tax1', align: 'start', key: 'biological_taxonomy' },
      { title: 'Tax2', align: 'start', key: 'has_taxonomic_identifier' },
      { title: 'Anatomical ID', align: 'start', key: 'has_anatomical_identifier' },
      { title: 'Stratum', align: 'start', key: 'stratum' },
      { title: 'Taxon', align: 'start', key: 'taxon' },
      { title: 'Element', align: 'start', key: 'element' },
      { title: 'Fragment', align: 'start', key: 'fragment_present' },
      { title: 'Bone#', align: 'end', key: 'bone_number' },
      { title: 'Snippet', align: 'start', key: 'snippet' },
    ]
  })

  return {
    beforeStore,
    tagFromSlug,
    slugParamsFromSlug,
    headers
  }
})
