// stores/trio.js
import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import type { TGroupValue, TGroupOrderBy, TGroupOrderByOptionObject } from '@/js/types/trioTypes'
import type { TGroupLocalBase, } from '@/js/types/trioTypes2'
import type { TParseQuery, TApiFilters, TSelectedFilterFromQuery } from '@/js/types/routesTypes'
import type { IObject } from '@/js/types/generalTypes'
import type { TApiArrayMain } from '@/js/types/collectionTypes'
import { useTrioStore } from './trio'
import { useTrioStore2 } from './trio2'
import { useXhrStore } from '../xhr'
import { useRoutesMainStore } from '../routes/routesMain'

export const useFilterStore = defineStore('filter', () => {
  const { send } = useXhrStore()
  const { current } = storeToRefs(useRoutesMainStore())
  const trio = useTrioStore()
  const trio2 = useTrioStore2()

  const selectedFilterParams = ref<string[]>([])
  const selectedFilterParams2 = ref<string[]>([])



  function filtersToQueryObject(): IObject {
    const query: IObject = {}
    selectedFilterParams.value.forEach(pk => {

      const pieces = pk.split('.')
      const groupKeyUnderlined = pieces[0].replace(/ /g, "_")
      const paramUnderlined = trio.trio.entities.params[pk].name.replace(/ /g, "_")

      if (Object.prototype.hasOwnProperty.call(query, groupKeyUnderlined)) {
        query[groupKeyUnderlined] += ',' + paramUnderlined
      } else {
        query[groupKeyUnderlined] = paramUnderlined
      }
    })
    console.log(`filtersToQueryObject().query: ${JSON.stringify(query, null, 2)}`);
    return query
  }

  function urlQueryToApiFilters(qp: IObject): TParseQuery {
    //console.log(`urlQueryToApiFilters().urlQuery: ${JSON.stringify(qp, null, 2)}`);
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
    const selectedFilters = <TSelectedFilterFromQuery[]>[]

    for (const [key, value] of Object.entries(qp)) {
      //Verify that the group exists. 
      const groupKey = key.replace(/_/g, " ")

      if (!Object.prototype.hasOwnProperty.call(trio.trio.entities.groups, groupKey)) {
        console.log(`Query parsing Error: "${key}" group doesn't exist`)
        return { success: false, apiFilters: all, selectedFilters: [], message: 'Group name doesn`t exist.' }
      }

      const group = trio.trio.entities.groups[groupKey]

      //verify that params exist for this group 
      const underlinedParams = <string[]>value.split(',')
      const params = underlinedParams.map(x => <string>x.replace(/_/g, " "))
      const possibleParams = group.params.map(x => {
        const pieces = x.split('.')
        return pieces[1]
      })

      //console.log(`key: ${groupKey}\nparams: ${params}\npossibleParams: ${possibleParams}\ngroup: ${JSON.stringify(group, null, 2)}`);
      if (group.group_type_code === 'CS') {
        //sanitize sql injections here
        params.forEach((x, index) => {
          selectedFilters.push({ param: group.group_name + '.term' + (index + 1), group_type_code: 'CS', extra: x })
        })
      } else if (group.group_type_code === 'OB') {
        const orderGroup = <TGroupOrderBy>trio.trio.entities.groups['Order By']
        const options = orderGroup.options.map(x => x.name)

        for (const [index, x] of params.entries()) {
          if (!['.A', '.D'].includes(x.slice(-2))) {
            console.log(`Query parsing Error: "${x}" order param doesn't end with '.A' or '.D'. aborting... `)
            return { success: false, apiFilters: all, selectedFilters: [], message: `Query parsing Error: "${x}" order param doesn't end with '.A' or '.D'.` }
          }
          if (!options.includes(x.slice(0, -2))) {
            console.log(`Query parsing Error: "${x}" param doesn't exist in group ${key}.`)
            return { success: false, apiFilters: all, selectedFilters: [], message: `Query parsing Error: "${x}" param doesn't exist in group ${key}.` }
          }
          selectedFilters.push({ param: group.group_name + '.ob' + (index + 1), group_type_code: 'OB', extra: x })
        }
      } else {
        for (const [index, x] of params.entries()) {
          if (!possibleParams.includes(x)) {
            console.log(`Query parsing Error: param[${index}] "${x}" doesn't exist in group "${key}".`)
            return { success: false, apiFilters: all, selectedFilters: [], message: `Query parsing Error: param[${index}] "${x}" doesn't exist in group "${key}".` }
          }
          selectedFilters.push({ param: group.group_name + '.' + x, group_type_code: group.group_type_code, extra: "" })
        }
      }

      //assign parameters to their correct 'filter' category
      switch (group.group_type_code) {
        case 'TG':
          all.global_tag_ids.push(...params.map(x => {
            const paramKey = groupKey + '.' + x
            return trio.trio.entities.params[paramKey].id
          }))
          break
        case 'TM':
          all.model_tag_ids.push(...params.map(x => {
            const paramKey = groupKey + '.' + x
            return trio.trio.entities.params[paramKey].id
          }))
          break
        case 'CL':
          //console.log(`urlQueryToApiFilters CL group: ${group.group_name} max: ${group.params.length} selectedParams.length: ${params.length}`)

          //apply filters only if not all selected ('CL' is a partition)
          if (params.length < trio.trio.entities.groups[groupKey].params.length) {
            all.column_lookup_ids.push({
              column_name: (<TGroupValue>trio.trio.entities.groups[groupKey]).column_name,
              vals: params.map(x => {
                const paramKey = groupKey + '.' + x
                return trio.trio.entities.params[paramKey].id
              })
            })
          }
          break

        case 'CV':
        case 'CR':
          //apply filters only if not all selected ('CV' & 'CR' are partitions)
          if (params.length < trio.trio.entities.groups[groupKey].params.length) {
            all.column_values.push({ column_name: (<TGroupValue>trio.trio.entities.groups[groupKey]).column_name, vals: params })
          }
          break

        case 'CB':
          //apply filters only if one value is selected ('CB' is boolean)
          if (params.length === 1) {
            all.column_values.push({ column_name: (<TGroupValue>trio.trio.entities.groups[groupKey]).column_name, vals: (params[0] === 'True') ? ['1'] : ['0'] })
          }
          break

        case 'CS':
          all.column_search.push({
            column_name: (<TGroupValue>trio.trio.entities.groups[groupKey]).column_name, vals: params
          })
          break

        case 'MD':
          switch (key) {
            case 'Media':
              all.bespoke.push({ name: key, vals: params })
              break

            case 'Area':
              all.bespoke.push({ name: key, vals: params })
              break
            default:
              console.log(`Query parsing Error: Unrecognized bespoke group ${key}. aborting... `)
              return { success: false, apiFilters: all, selectedFilters: [], message: `Query parsing Error: Unrecognized bespoke group ${key}.` }
          }
          break

        case 'OB':
          processOrderBy(params, all.order_by)
      }
    }

    //console.log(`urlQueryToApiFilters()\nquery: ${JSON.stringify(all, null, 2)}`);
    return { success: true, apiFilters: all, selectedFilters, message: 'urlQuery parsing successsful' }
  }

  function processOrderBy(params: string[],
    order_by: {
      column_name: string,
      asc: boolean,
    }[]) {
    console.log(`processing Order By group`)
    const orderGroup = <TGroupOrderBy>trio.trio.entities.groups['Order By']
    params.forEach(x => {
      const data = orderGroup.options.find(y => y.name === x.slice(0, -2));
      order_by.push({
        column_name: (<TGroupOrderByOptionObject>data).column_name, asc: x.slice(-1) === 'A'
      })
    })
  }

  function addRemoveSearchParam(paramKey: string) {
    if (selectedFilterParams.value.some(x => x === paramKey)) {
      const i = selectedFilterParams.value.indexOf(paramKey)
      selectedFilterParams.value.splice(i, 1)
    } else {
      selectedFilterParams.value.push(paramKey)
    }
  }

  function resetSelectedFilters() {
    orderByClear()    
    selectedFilterParams2.value = []
  }

  function clearSelectedFilters() {
    console.log(`filter.clearSelectedFilters()`)
    selectedFilterParams.value.forEach(x => {
      const pieces = x.split('.')
      switch (trio.trio.entities.groups[pieces[0]].group_type_code) {
        case 'OB':
          trio.setOrderByString(x, "")
          break
        case 'CS':
          trio.setFilterSearchTerm(x, "")
          break
        default:
        //nothing to do except remove from selectedFilters
      }
    })
    selectedFilterParams.value = []

    for (const [key, value] of Object.entries(trio2.groupLabelToKey)) { 
      if(trio2.trio.groupsObj[value].code === 'CS') {
        trio2.trio.groupsObj[value].paramKeys.forEach(x => {
          trio2.trio.paramsObj[x].text = ''
          trio2.trio.paramsObj[x].extra = null
        })
      }
    }
    orderByClear()
    selectedFilterParams2.value = []
  }

  function setFiltersFromUrlQuery(filters: TSelectedFilterFromQuery[]) {
    //console.log(`filter.setFiltersFromUrlQuery()`)
    filters.forEach(x => {
      switch (x.group_type_code) {
        case 'OB':
          trio.setOrderByString(x.param, x.extra)
          break
        case 'CS':
          trio.setFilterSearchTerm(x.param, x.extra)
          break
        default:
          selectedFilterParams.value.push(x.param)
      }
    })
  }

  async function getCount() {
    const q = filtersToQueryObject()
    const res1 = urlQueryToApiFilters(q)
    const res2 = await send<TApiArrayMain[]>('model/index', 'post', { model: current.value.module, query: res1.apiFilters })
    return res2.success ? res2.data.length : -1
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
    orderParamClicked,
    orderByClear,
    filtersToQueryObject,
    urlQueryToApiFilters,
    addRemoveSearchParam,
    clearSelectedFilters,
    setFiltersFromUrlQuery,
    getCount,
    resetSelectedFilters,
    searchTextChanged,
    searchTextClearCurrent
  }
})