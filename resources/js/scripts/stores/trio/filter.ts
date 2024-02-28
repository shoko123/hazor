// stores/trio.js
import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import type { LocationQuery, LocationQueryValue } from 'vue-router'
import type { TGroupValue, TGroupOrderBy, TGroupOrderByOptionObject } from '@/js/types/trioTypes'
import type { TGroupLocalBase, TGroupLocalColumn } from '@/js/types/trioTypes2'
import type { TParseQuery, TApiFilters, TSelectedFilterFromQuery } from '@/js/types/routesTypes'
import type { IObject, IStringObject } from '@/js/types/generalTypes'
import type { TApiArrayMain } from '@/js/types/collectionTypes'
import { useTrioStore2 } from './trio2'
import { useXhrStore } from '../xhr'
import { useRoutesMainStore } from '../routes/routesMain'

export const useFilterStore = defineStore('filter', () => {
  const { send } = useXhrStore()
  const { current } = storeToRefs(useRoutesMainStore())
  const trio2 = useTrioStore2()

  const selectedFilterParams = ref<string[]>([])
  const selectedFilterParams2 = ref<string[]>([])

  function filtersToQueryObject() {
    let q2: IStringObject = {}
    selectedFilterParams2.value.sort((a, b) => { return a > b ? 1 : -1 })
    selectedFilterParams2.value.forEach(k => {
      const paramUlined = trio2.trio.paramsObj[k].text.replace(/ /g, "_")
      const groupUlined = trio2.trio.groupsObj[trio2.trio.paramsObj[k].groupKey].label.replace(/ /g, "_")
      if (Object.prototype.hasOwnProperty.call(q2, groupUlined)) {
        q2[groupUlined] += ',' + paramUlined
      } else {
        q2[groupUlined] = paramUlined
      }
    })
    console.log(`filtersToQueryObject().q2: ${JSON.stringify(q2, null, 2)}`);
    return q2
  }

  const apiQueryPayload = computed<TApiFilters>(() => {
    const all: TApiFilters = {
      model_tag_ids: [],
      global_tag_ids: [],
      column_values: [],
      column_lookup_ids: [],
      column_search: [],
      media: [],
      bespoke: [],
      order_by: [],
    }


    if (trio2.trio.categories.length === 0) { return all }

    //push params into their correct arrays, according to group type
    selectedFilterParams2.value.forEach(key => {
      const param = trio2.trio.paramsObj[key]
      const group = trio2.trio.groupsObj[trio2.trio.paramsObj[key].groupKey]

      switch (group.code) {
        case 'CV':
        case 'CR':
          {
            const i = all.column_values.findIndex(x => {
              return x.column_name === (<TGroupLocalColumn>group).column_name
            })
            if (i === -1) {
              //if new group, push the param's group into the groups array with itself as the first param
              all.column_values.push({ column_name: (<TGroupLocalColumn>group).column_name, vals: [param.text] })

            } else {
              //if the group is already selected, add param's text to the group's params array
              all.column_values[i].vals.push(param.text)
            }
          }
          break
        case 'CL': {
          const i = all.column_lookup_ids.findIndex(x => {
            return x.column_name === (<TGroupLocalColumn>group).column_name
          })
          if (i === -1) {
            //if new group, push the param's group into the groups array with itself as the first param
            all.column_lookup_ids.push({ column_name: (<TGroupLocalColumn>group).column_name, vals: [<number>param.extra] })

          } else {
            //if the group is already selected, add param's text to the group's params array
            all.column_lookup_ids[i].vals.push(<number>param.extra)
          }
        }
          break

        case 'CB': {
          const i = all.column_values.findIndex(x => {
            return x.column_name === (<TGroupLocalColumn>group).column_name
          })
          if (i === -1) {
            //if new group, push the param's group into the groups array with itself as the first param
            all.column_values.push({ column_name: (<TGroupLocalColumn>group).column_name, vals: [<string>param.extra] })

          } else {
            //if the group is already selected, add param's text to the group's params array
            all.column_values[i].vals.push(<string>param.extra)
          }
        }

        case 'CS': {
          const i = all.column_search.findIndex(x => {
            return x.column_name === (<TGroupLocalColumn>group).column_name
          })
          if (i === -1) {
            //if new group, push the param's group into the groups array with itself as the first param
            all.column_search.push({ column_name: (<TGroupLocalColumn>group).column_name, vals: [param.text] })

          } else {
            //if the group is already selected, add param's text to the group's params array
            all.column_search[i].vals.push(param.text)
          }
        }
          break
        case 'TM': {
          all.model_tag_ids.push(<number>param.extra)
        }
          break
        case 'TG': {
          all.global_tag_ids.push(<number>param.extra)
        }
          break
        case 'MD': {
          all.media.push(param.text)
        }
          break
        case 'OB': {
          const ordeByItem = trio2.orderByOptions.find(x => x.name === param.text.slice(0, -2))
          all.order_by.push({ column_name: <string>ordeByItem?.column_name, asc: param.text.slice(-1) === 'A' })
        }
          break
      }
    })

    return all
  })

  function urlQueryToApiFilters(qp: LocationQuery): { success: true } | { success: false, message: string } {
    //console.log(`urlQueryToApiFilters().urlQuery: ${JSON.stringify(qp, null, 2)}`);

    if (qp === null) {
      return { success: true }
    }
    for (const [key, value] of Object.entries(qp)) {
      if (value === null) {
        continue
      }

      console.log(`urlQueryEntry(${key}) =>: ${JSON.stringify((<string>value).split(','), null, 2)}`);

      const undoUnderKey = key.replace(/_/g, " ")
      if (undoUnderKey in trio2.groupLabelToKey === false) {
        return { success: false, message: `Unrecognized Url query parameter "${undoUnderKey}"` }
      }
      const group = trio2.trio.groupsObj[trio2.groupLabelToKey[undoUnderKey]]
      const paramTexts = (<string>value).split(',')
      switch (group.code) {
        case 'OB': {
          const res = processUrlOB(group, paramTexts)
          if (!res.success) { return res }
        }
          break

        case 'CS':{
          const res = processUrlCS(group, paramTexts)
          if (!res.success) { return res }
        }
          break

        default: {
          const res = processUrlDefault(group, paramTexts.map(x => x.replace(/_/g, " ")))
          if (!res.success) { return res }
        }
          break
      }
    }

    return { success: true }
  }

  function processUrlDefault(group: TGroupLocalBase, paramTexts: string[]): { success: true } | { success: false, message: string } {
    for (const x of paramTexts) {
      const i = group.paramKeys.findIndex(y => trio2.trio.paramsObj[y].text === x)
      if (i === -1) {
        return { success: false, message: `*** Url option "${x}" is illegal for parameter "${group.label}".` }
      }
      selectedFilterParams2.value.push(group.paramKeys[i])
    }
    return { success: true }
  }
  
  function processUrlOB(group: TGroupLocalBase, paramTexts: string[]): { success: true } | { success: false, message: string } {
    let selected: string[] = []
    for (const x of paramTexts) {
      const nameOnly = x.slice(0, -2)
      const lastTwo = x.substring(x.length - 2)

      if (selected.some(y => y === nameOnly)) {
        return { success: false, message: `Duplicate url Order By parameter "${nameOnly}".` }
      }

      const ordeByIndex = trio2.orderByOptions.findIndex(y => y.name === nameOnly)

      if (ordeByIndex === undefined || lastTwo !== '.A' && lastTwo !== '.D') {
        return { success: false, message: `Unrecognized url Order By parameter "${x}".` }
      }

      const firstEmptyParamKey = group.paramKeys.find(x => trio2.trio.paramsObj[x].text === '')
      if (firstEmptyParamKey === undefined) {
        return { success: false, message: `Problem with url Order By parameter "${x}".` }
      }
      trio2.trio.paramsObj[firstEmptyParamKey].text = x
      selectedFilterParams2.value.push(firstEmptyParamKey)
      selected.push(nameOnly)
    }
    return { success: true }
  }

  function processUrlCS(group: TGroupLocalBase, paramTexts: string[]): { success: true } | { success: false, message: string } {
    if(paramTexts.length > 6){
       return { success: false, message: `Url query problem: Too many search terms for parameter "${group.label}".` }
    }
    for (const x of paramTexts) {
      const firstEmptyParamKey = group.paramKeys.find(x => trio2.trio.paramsObj[x].text === '')
      if (firstEmptyParamKey === undefined) {
        return { success: false, message: `Problem with url search parameter "${x}".` }
      }
      trio2.trio.paramsObj[firstEmptyParamKey].text = x
      selectedFilterParams2.value.push(firstEmptyParamKey)
    }
    return { success: true }
  }

  function clearSelectedFilters() {
    console.log(`filter.clearSelectedFilters()`)
    // selectedFilterParams.value.forEach(x => {
    //   const pieces = x.split('.')
    //   switch (trio.trio.entities.groups[pieces[0]].group_type_code) {
    //     case 'OB':
    //       trio.setOrderByString(x, "")
    //       break
    //     case 'CS':
    //       trio.setFilterSearchTerm(x, "")
    //       break
    //     default:
    //     //nothing to do except remove from selectedFilters
    //   }
    // })
    // selectedFilterParams.value = []

    for (const [key, value] of Object.entries(trio2.groupLabelToKey)) {
      if (trio2.trio.groupsObj[value].code === 'CS') {
        trio2.trio.groupsObj[value].paramKeys.forEach(x => {
          trio2.trio.paramsObj[x].text = ''
          trio2.trio.paramsObj[x].extra = null
        })
      }
    }
    orderByClear()
    selectedFilterParams2.value = []
  }

  async function getCount() {
    const res = await send<TApiArrayMain[]>('model/index', 'post', { model: current.value.module, query: apiQueryPayload.value })
    return res.success ? res.data.length : -1
  }

  const textSearchParamKeys = computed(() => {
    const currentGroup = trio2.currentGroup
    return (<TGroupLocalBase>currentGroup).paramKeys
  })

  function searchTextChanged(index: number, val: any) {
    const paramKey = textSearchParamKeys.value[index]
    //console.log(`changeOccured() index: ${index} setting param with key ${paramKey} to: ${val}`)
    trio2.trio.paramsObj[paramKey].text = val

    //add/remove from selected filters
    const inSelected = selectedFilterParams2.value.includes(paramKey)
    if (inSelected && val === '') {
      const i = selectedFilterParams2.value.indexOf(paramKey)
      selectedFilterParams2.value.splice(i, 1)
    }
    if (!inSelected && val !== '') {
      selectedFilterParams2.value.push(paramKey)
    }
  }

  function searchTextClearCurrent() {
    console.log(`clear()`)
    textSearchParamKeys.value.forEach(x => {
      trio2.trio.paramsObj[x].text = ''

      //if currently in selectedFilters, then remove.
      if (selectedFilterParams2.value.includes(x)) {
        const i = selectedFilterParams2.value.indexOf(x)
        selectedFilterParams2.value.splice(i, 1)
      }
    })
  }

  //order by
  ///////////

  function orderParamClicked(index: number, asc: boolean) {
    let orderByParams = trio2.orderByGroup?.paramKeys.map(x => { return { ...trio2.trio.paramsObj[x], key: x } })

    if (orderByParams === undefined) {
      console.log(`serious error - abort *********`)
      return
    }

    const firstEmptyParam = orderByParams.find(x => x.text === '')
    if (firstEmptyParam === undefined) {
      console.log(`serious error - abort *********`)
      return
    }

    let label = `${trio2.orderByAvailable[index].name}.${asc ? 'A' : 'D'}`
    // console.log(`paramClicked(${index}) asc: ${asc} params:  ${JSON.stringify(orderByParams, null, 2)} key: ${firstEmptyParam.key} label: ${label}`)

    trio2.trio.paramsObj[firstEmptyParam.key].text = label
    selectedFilterParams2.value.push(firstEmptyParam.key)
  }

  function orderByClear() {
    console.log(`orderClear`)
    trio2.orderByGroup?.paramKeys.forEach(x => {
      trio2.trio.paramsObj[x].text = ''
      if (selectedFilterParams2.value.includes(x)) {
        const i = selectedFilterParams2.value.indexOf(x)
        selectedFilterParams2.value.splice(i, 1)
      }
    })


  }
  return {
    selectedFilterParams,
    selectedFilterParams2,
    apiQueryPayload,
    orderParamClicked,
    orderByClear,
    filtersToQueryObject,
    urlQueryToApiFilters,
    clearSelectedFilters,
    getCount,
    searchTextChanged,
    searchTextClearCurrent
  }
})