// stores/trio.js
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import type { TApiTrio2, TApiGroupColumn, TApiParamNameAndId, TTrioCodeUnion, TTrioAll } from '../../../types/trioTypes2'
import { useFilterStore } from './filter'
import { useTaggerStore } from './tagger'
import { useRoutesMainStore } from '../routes/routesMain'

export const useTrio2Store = defineStore('trio2', () => {
  const { selectedFilterParams } = storeToRefs(useFilterStore())

  type TParam = { [key: string]: { text: string, id?: number, groupKey: string } }
  type TGroup = { [key: string]: { label: string, group_type_code: TTrioCodeUnion, paramKeys: string[], categoryIndex: number } }//TTrioAll['group']{ name: string, code: TTrioAll['code'], paramKeys: string[], categoryIndex: number } }
  type TKeyOfGroupsObj = keyof TGroup
  const categories = ref<{ name: string, groupKeys: string[] }[]>([])
  const groupsObj = ref<TGroup>({})
  const paramsObj = ref<TParam>({})



  //index in visible categories
  const categoryIndex = ref<number>(0)

  //index in visible groups
  const groupIndex = ref<number>(0)

  function setTrio2(apiTrio: TApiTrio2) {
    categories.value = []
    groupsObj.value = {}
    paramsObj.value = {}

    let catCnt = 0, grpCnt = 0, prmCnt = 0
    apiTrio.forEach(cat => {
      categories.value.push({ name: cat.name, groupKeys: [] })
      cat.groups.forEach(grp => {
        let grpKey = pad(grpCnt, 3)
        categories.value[catCnt].groupKeys.push(grpKey)
        groupsObj.value[grpKey] = { label: grp.group_name, group_type_code: grp.group_type_code, paramKeys: [], categoryIndex: catCnt }


        switch (grp.group_type_code) {
          case 'CL':
            processGroupCL(grpKey, <TApiGroupColumn<'CL', TApiParamNameAndId>>grp)
            break
          case 'CV':
            processGroupCV(grpKey, <TApiGroupColumn<'CV', TApiParamNameAndId>>grp)
            break
          case 'CB':
            processGroupCB(grpKey, <TApiGroupColumn<'CB', TApiParamNameAndId>>grp)
            break
            case 'CR':
            processGroupCR(grpKey, <TApiGroupColumn<'CR', TApiParamNameAndId>>grp)
            break
          case 'CS':
            processGroupCS(grpKey, <TApiGroupColumn<'CS', TApiParamNameAndId>>grp)
            break
          case 'TM':
            processGroupTM(grpKey, <TApiGroupColumn<'TM', TApiParamNameAndId>>grp)
            break
          case 'TG':
            processGroupTG(grpKey, <TApiGroupColumn<'TG', TApiParamNameAndId>>grp)
            break
          case 'MD':
            processGroupMD(grpKey, <TApiGroupColumn<'MD', TApiParamNameAndId>>grp)
            break
          case 'BF':
            processGroupBF(grpKey, <TApiGroupColumn<'BF', TApiParamNameAndId>>grp)
            break
          case 'OB':
            processGroupOB(grpKey, <TApiGroupColumn<'OB', TApiParamNameAndId>>grp)
            break
          default:
        }
        grpCnt++
      })
      catCnt++
    })

    function processGroupCL(grpKey: string, grp: TApiGroupColumn<'CL', TApiParamNameAndId>) {
      grp.params.forEach(p => {
        let prmKey = pad(prmCnt, 3)
        groupsObj.value[grpKey].paramKeys.push(prmKey)
        paramsObj.value[prmKey] = { text: p.name, id: p.id, groupKey: pad(grpCnt, 3) }
        prmCnt++
      })
    }
    function processGroupCV(grpKey: string, grp: TApiGroupColumn<'CV', TApiParamNameAndId>) {
      grp.params.forEach(p => {
        let prmKey = pad(prmCnt, 3)
        groupsObj.value[grpKey].paramKeys.push(prmKey)
        paramsObj.value[prmKey] = { text: p.name, groupKey: pad(grpCnt, 3) }
        prmCnt++
      })
    }
    function processGroupCB(grpKey: string, grp: TApiGroupColumn<'CB', TApiParamNameAndId>) {
      grp.params.forEach(p => {
        let prmKey = pad(prmCnt, 3)
        groupsObj.value[grpKey].paramKeys.push(prmKey)
        paramsObj.value[prmKey] = { text: p.name, groupKey: pad(grpCnt, 3) }
        prmCnt++
      })
    }
    function processGroupCR(grpKey: string, grp: TApiGroupColumn<'CR', TApiParamNameAndId>) {
      grp.params.forEach(p => {
        let prmKey = pad(prmCnt, 3)
        groupsObj.value[grpKey].paramKeys.push(prmKey)
        paramsObj.value[prmKey] = { text: p.name, groupKey: pad(grpCnt, 3) }
        prmCnt++
      })
    }    
    function processGroupCS(grpKey: string, grp: TApiGroupColumn<'CS', TApiParamNameAndId>) {
      grp.params.forEach(p => {
        let prmKey = pad(prmCnt, 3)
        groupsObj.value[grpKey].paramKeys.push(prmKey)
        paramsObj.value[prmKey] = { text: p.name, groupKey: pad(grpCnt, 3) }
        prmCnt++
      })
    }
    function processGroupTM(grpKey: string, grp: TApiGroupColumn<'TM', TApiParamNameAndId>) {
      grp.params.forEach(p => {
        let prmKey = pad(prmCnt, 3)
        groupsObj.value[grpKey].paramKeys.push(prmKey)
        paramsObj.value[prmKey] = { text: p.name, groupKey: pad(grpCnt, 3) }
        prmCnt++
      })
    }
    function processGroupTG(grpKey: string, grp: TApiGroupColumn<'TG', TApiParamNameAndId>) {
      grp.params.forEach(p => {
        let prmKey = pad(prmCnt, 3)
        groupsObj.value[grpKey].paramKeys.push(prmKey)
        paramsObj.value[prmKey] = { text: p.name, groupKey: pad(grpCnt, 3) }
        prmCnt++
      })
    }
    function processGroupMD(grpKey: string, grp: TApiGroupColumn<'MD', TApiParamNameAndId>) {
      grp.params.forEach(p => {
        let prmKey = pad(prmCnt, 3)
        groupsObj.value[grpKey].paramKeys.push(prmKey)
        paramsObj.value[prmKey] = { text: p.name, groupKey: pad(grpCnt, 3) }
        prmCnt++
      })
    }
    function processGroupBF(grpKey: string, grp: TApiGroupColumn<'BF', TApiParamNameAndId>) {
      grp.params.forEach(p => {
        let prmKey = pad(prmCnt, 3)
        groupsObj.value[grpKey].paramKeys.push(prmKey)
        paramsObj.value[prmKey] = { text: p.name, groupKey: pad(grpCnt, 3) }
        prmCnt++
      })
    }
    function processGroupOB(grpKey: string, grp: TApiGroupColumn<'OB', TApiParamNameAndId>) {
      grp.params.forEach(p => {
        let prmKey = pad(prmCnt, 3)
        groupsObj.value[grpKey].paramKeys.push(prmKey)
        paramsObj.value[prmKey] = { text: p.name, groupKey: pad(grpCnt, 3) }
        prmCnt++
      })
    }
  }

  function assert(condition: unknown, msg?: string): asserts condition {
    if (condition === false) throw new Error(msg)
  }

  function paramDetails(paramKey: string) {
    //console.log(`paramDetails(${paramKey}) `)
    if (paramKey in paramsObj.value) {
      const prm = paramsObj.value[paramKey]
      const grp = groupsObj.value[prm.groupKey]
      //console.log(`paramDetails(${paramKey}) =>  ${JSON.stringify(paramsObj.value[paramKey], null, 2)}. grp:  ${JSON.stringify(grp, null, 2)}`)
      return {
        text: paramsObj.value[paramKey].text,
        groupCode: grp.group_type_code,
        groupLabel: grp.label
      }
    } else {
      //console.log(`paramDetails(${paramKey}) =>  undefined`)
      return undefined
    }

  }

  function groupDetails(groupKey: string) {
    assert(groupKey in groupsObj.value, `groupObj[${groupKey}] doesn't exist!`)

    const grp = groupsObj.value[groupKey]
    //console.log(`paramDetails(${groupKey}) =>  ${JSON.stringify(paramsObj.value[groupKey], null, 2)}. grp:  ${JSON.stringify(grp, null, 2)}`)
    return {
      label: grp.label,
      groupCode: grp.group_type_code,
      params: grp.paramKeys.reduce(
        (accumulator, currentValue) => accumulator + paramsObj.value[currentValue].text + ', ',
        ''
      )
    }
  }


  const groups = computed(() => {
    let grpList: { label: string, groupCode: string, params: string }[] = []
    for (const [key, value] of Object.entries(groupsObj.value)) {
      grpList.push(groupDetails(key))
    }
    return grpList
  })

  const params = computed(() => {
    let paramList = []
    for (let i = 0; i < 50; i++) {
      let key = pad(i, 3)
      paramList.push(paramDetails(key))
    }
    return paramList
  })


  function pad(num: number, size: number): string {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  return {
    categories,
    groupsObj,
    paramsObj,
    groups,
    setTrio2,
  }
})