import { computed } from 'vue'
import { defineStore } from 'pinia'
import { TFieldsGeneric, TFieldsUnion, TFuncValidateSlug } from '@/js/types/moduleTypes'

export const useLocusStore = defineStore('locus', () => {
  const reNameIsLocusNo = /^\d{1,5}$/
  // const reNameIsLocusNoWithAddendum = /^\d{+}[a-c]$/
  // const reNameIsYearHyphenLocusNo = /^\d{2}-\d{3}$/
  // const reNameIsYearAreaHyphenLocusNo = /^\d{2}[A-Z]\d{1}-\d{3}$/

  const validateSlug: TFuncValidateSlug = function(slug: string) { 
    const arr = slug.split('.');

    if (arr.length === 2) {
      return {
        success: true,
        data: {
          area: arr[0],
          name: arr[1]
        },
        message: '',
      }
    }
    return { success: false, data: null, message: "No . [dot] detected in slug." }
  }

  function tagFromSlug(slug: string): string {
    return slug.replace('.', '/')
  }

  function beforeStore(isCreate: boolean, fields: TFieldsUnion): TFieldsUnion | false {
    //console.log(`locus.beforStore() isCreate: ${isCreate}  fields: ${JSON.stringify(fields, null, 2)}`)
    const lf = <TFieldsGeneric<'Locus'>>fields
    if (isCreate) {
      const rf = { ...lf }
      if (reNameIsLocusNo) {
        rf.locus_no = lf.name as unknown as number
        rf.addendum = ""
      }
      return rf
    } else {
      return lf
    }
  }

  const headers = computed(() => {
    return [
      { title: 'Name', align: 'start', key: 'tag', },
      { title: 'Year', align: 'end', key: 'year' },
      { title: 'Type', align: 'start', key: 'type' },
      { title: 'Cross Reference', align: 'start', key: 'cross_ref' },
      { title: 'Description', align: 'start', key: 'description' },
      { title: 'Stratum', align: 'start', key: 'stratum' },
      { title: 'Square', align: 'start', key: 'square' },
      { title: 'Elevation', align: 'start', key: 'elevation' },

    ]
  })

  return {
    beforeStore,
    tagFromSlug,
    validateSlug,
    headers
  }
})