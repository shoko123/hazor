// stores/trio.js
import { defineStore, storeToRefs } from 'pinia'
import type { TApiTrio, TApiGroupColumn, TGroupUnion, TGroupLocalUnion, TApiGroupTag, TApiGroupBasic, TParamObj, TApiParamNameAndColumn, TGroupObj, TCategoriesArray, TApiGroupOrderBy, TGroupLocalColumn, TGroupLabelToKey, TApiParamNameAndId, TApiParamName } from '../../../types/trioTypes2'
import { useMediaStore } from '../media'

export const useTrioNormalizerStore = defineStore('trioNorm2', () => {
  const { mediaCollectionNames } = storeToRefs(useMediaStore())

  let categories: TCategoriesArray = []
  let groupsObj: TGroupObj = {}
  let paramsObj: TParamObj = {}
  let groupLabelToKey: TGroupLabelToKey = {}
  let fieldNameToGroupKey: TGroupLabelToKey = {}
  let orderByOptions: TApiParamNameAndColumn[] = []
  let catCnt = 0, grpCnt = 0, prmCnt = 0

  function reset() {
    categories = []
    groupsObj = {}
    paramsObj = {}
    groupLabelToKey = {}
    fieldNameToGroupKey = {}
    catCnt = 0, grpCnt = 0, prmCnt = 0
  }

  function normalizeTrio(apiTrio: TApiTrio) {
    reset()
    apiTrio.forEach(cat => {
      categories.push({ name: cat.name, groupKeys: [] })
      cat.groups.forEach(grp => {
        const grpKey = pad(grpCnt, 3)
        categories[catCnt].groupKeys.push(grpKey)
        let group: TGroupUnion = { label: '', code: 'CV', params: [] }

        //console.log(`normalize2() before handle group #${grpCnt}`)
        switch (grp.group_type_code) {
          case 'CL':
            group = handleCL(<TApiGroupColumn>grp)
            break
          case 'CV':
            group = handleCV(<TApiGroupColumn>grp)
            break
          case 'CB':
            group = handleCB(<TApiGroupColumn>grp)
            break
          case 'CR':
            group = handleCR(<TApiGroupColumn>grp)
            break
          case 'CS':
            group = handleCS(<TApiGroupColumn>grp)
            break
          case 'TM':
            group = handleTag(<TApiGroupTag>grp)
            break
          case 'TG':
            group = handleTag(<TApiGroupTag>grp)
            break
          case 'MD':
            group = handleMD(<TApiGroupBasic>grp)
            break

          case 'OB':
            group = handleOB(<TApiGroupOrderBy>grp)
            break
          default:
        }
        saveGroupAndParams(grpKey, group)
        grpCnt++
      })
      catCnt++
    })

    return { trio: { categories, groupsObj, paramsObj }, groupLabelToKey, fieldNameToGroupKey, orderByOptions }
  }
  function saveGroupAndParams(grpKey: string, grp: TGroupUnion) {
    //console.log(`saveGroup(): ${JSON.stringify(grp, null, 2)}`);

    //add trio related fields
    const grpWithParams = { ...grp, paramKeys: [], categoryIndex: catCnt }

    //remove params array
    const grpToSave: TGroupLocalUnion = { ...(({ params, ...object }) => object)(grpWithParams) }

    //save params and then group
    grp.params.forEach(p => {
      const prmKey = pad(prmCnt, 3)
      grpToSave.paramKeys.push(prmKey)
      paramsObj[prmKey] = { text: p.text, extra: p.extra, groupKey: pad(grpCnt, 3) }
      prmCnt++
    })
    groupsObj[grpKey] = grpToSave
    groupLabelToKey[grpToSave.label] = grpKey
    if(['CL', 'CV', 'CR', 'CB'].includes(grp.code)){
      fieldNameToGroupKey[(<TGroupLocalColumn>grpToSave).column_name] = grpKey
    }
  }

  function processDependency(dependency: string[]) {
    //console.log(`processDep() groupLabelToKey: ${JSON.stringify(groupLabelToKey, null, 2)}`);        
    return dependency === null ? [] : dependency.map(x => {
      const pieces = x.split('.')
      const group = groupsObj[groupLabelToKey[pieces[0]]]
      //console.log(`groupLabel: ${pieces[0]}. key: ${groupLabelToKey[pieces[0]]}  `);      
      return group.paramKeys.find(x => paramsObj[x].text === pieces[1])
    })
  }

  function handleTag(grp: TApiGroupTag) {
    const params = (<TApiParamNameAndId[]>grp.params).map(x => {
      return { text: x.name, extra: x.id }
    })

    return {
      label: grp.group_name,
      code: grp.group_type_code,
      params,
      dependency: processDependency(<string[]>grp.dependency),
      multiple: grp.multiple,
      group_id: grp.group_id
    }
  }

  function handleCL(grp: TApiGroupColumn) {
    const params = (<TApiParamNameAndId[]>grp.params).map(x => {
      return { text: x.name, extra: x.id }
    })

    return {
      label: grp.group_name,
      code: grp.group_type_code,
      params,
      dependency: processDependency(<string[]>grp.dependency),
      column_name: grp.column_name
    }
  }
  function handleCV(grp: TApiGroupColumn) {
    const params = (<string[]>grp.params).map(x => {
      return { text: x, extra: null }
    })
    return {
      label: grp.group_name,
      code: grp.group_type_code,
      params,
      column_name: grp.column_name,
    }
  }
  function handleCB(grp: TApiGroupColumn) {
    const params = (<TApiParamName[]>grp.params).map((x, index) => {
      return { text: x.name, extra: index === 0 ? 1 : 0 }
    })
    return {
      label: grp.group_name,
      code: grp.group_type_code,
      column_name: grp.column_name,
      params,
    }
  }
  function handleCR(grp: TApiGroupColumn) {
    const params = (<TApiParamName[]>grp.params).map(x => {
      return { text: x.name, extra: null }
    })
    return {
      label: grp.group_name,
      code: grp.group_type_code,
      params,
      column_name: grp.column_name,
    }
  }
  function handleCS(grp: TApiGroupColumn) {
    return {
    
      label: grp.group_name,
      code: grp.group_type_code,
      params: Array(6).fill({ text: '', extra: null }),
      column_name: grp.column_name,
    }
  }

  function handleMD(grp: TApiGroupBasic) {
    return {
      label: grp.group_name,
      code: grp.group_type_code,
      params: mediaCollectionNames.value.map(x => { return { text: x, extra: null } }),
    }
  }
  function handleBF(grp: TApiGroupColumn) {
    return {
      label: grp.group_name,
      code: grp.group_type_code,
      params: [],
    }
  }
  function handleOB(grp: TApiGroupOrderBy) {
    orderByOptions = grp.options
    return {
      label: grp.group_name,
      code: grp.group_type_code,
      params: Array(grp.options.length).fill({ text: '', extra: null }),
    }
  }
  function assert(condition: unknown, msg?: string): asserts condition {
    if (condition === false) throw new Error(msg)
  }

  function pad(num: number, size: number): string {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  return {
    normalizeTrio,
  }
})