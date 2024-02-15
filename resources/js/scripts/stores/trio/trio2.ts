// stores/trio.js
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import type { TApiTrio2, TApiGroupColumn, TGroupUnion, TGroupLocalUnion, TApiGroupTag, TTrioAll, TTrio, TGroupTag, TGroupColumn, TGroupLocalBase, TGroupLocalColumn, TGroupLocalTag, TParam, TParamLocal } from '../../../types/trioTypes2'
import { useFilterStore } from './filter'
import { useTrioNormalizerStore2 } from './trioNormalizer2'

export const useTrio2Store = defineStore('trio2', () => {
  const { selectedFilterParams } = storeToRefs(useFilterStore())
 const { normalizeTrio2 } = useTrioNormalizerStore2()


  const trio = ref<TTrio>({categories: [], groupsObj: {}, paramsObj: {}})

  function setTrio2(apiTrio: TApiTrio2) {
    trio.value = {categories: [], groupsObj: {}, paramsObj: {}}
      trio.value = normalizeTrio2(apiTrio);


  }


  function paramDetails(paramKey: string) {
    //console.log(`paramDetails(${paramKey}) `)
    // if (paramKey in paramsObj.value) {
    //   const prm = paramsObj[paramKey]
    //   const grp = groupsObj[prm.groupKey]
    //   //console.log(`paramDetails(${paramKey}) =>  ${JSON.stringify(paramsObj.value[paramKey], null, 2)}. grp:  ${JSON.stringify(grp, null, 2)}`)
    //   return {
    //     text: paramsObj[paramKey].text,
    //     code: grp.code,
    //     groupLabel: grp.label
    //   }
    // } else {
    //   //console.log(`paramDetails(${paramKey}) =>  undefined`)
    //   return undefined
    // }

  }

  function assert(condition: unknown, msg?: string): asserts condition {
    if (condition === false) throw new Error(msg)
  }

  function groupDetails(groupKey: string) {
    assert(groupKey in trio.value.groupsObj, `groupObj[${groupKey}] doesn't exist!`)

    const grp = trio.value.groupsObj[groupKey]
    //console.log(`paramDetails(${groupKey}) =>  ${JSON.stringify(paramsObj.value[groupKey], null, 2)}. grp:  ${JSON.stringify(grp, null, 2)}`)
    return {
      label: grp.label,
      groupCode: grp.code,
      params: grp.paramKeys.reduce(
        (accumulator, currentValue) => accumulator + trio.value.paramsObj[currentValue].text + ', ',
        ''
      )
    }
  }


  const groups = computed(() => {
    let grpList = []
    for (const [key, value] of Object.entries(trio.value.groupsObj)) {
      let g = grpList.push(groupDetails(key))
    console.log(`grpList(${key}) =>  ${JSON.stringify(g, null, 2)}`)

    }
    return grpList
  })

  return {
    trio,
    groups,
    setTrio2,
  }
})