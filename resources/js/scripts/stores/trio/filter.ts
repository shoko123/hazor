// stores/trio.js
import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'

import type { TGroupValue, TGroupOrderBy, TGroupOrderByOptionObject, } from '../../../types/trioTypes'
import type { IObject } from '../../../types/generalTypes'
import type { TParseUrlQueryResponse, TParseQueryData, TApiFilters, TSelectedFilterFromQuery } from '@/js/types/routesTypes'
import { useTrioStore } from './trio'

export const useFilterStore = defineStore('filter', () => {
  const trio = useTrioStore()
  let selectedFilterParams = ref<string[]>([])

  const orderSelectedNames = computed(() => {
    let orderParamKeys = selectedFilterParams.value.filter(x => {
      return (x.split('.')[0] === 'Order By')
    })
    let names = <string[]>orderParamKeys.map(y => (trio.trio.entities.params[y].name))
    return names
  })

  const orderAllNames = computed(() => {
    if (trio.trio.result.length === 0) { return [] }
    let orderGroup = <TGroupOrderBy>trio.trio.entities.groups['Order By']
    return orderGroup.options.map(x => x.name)
  })

  const orderAvailableNames = computed(() => {
    let osn = orderSelectedNames.value.map(x => x.slice(0, -2))
    return orderAllNames.value.filter(x => !osn.includes(x))
  })

  function orderParamClicked(index: number, asc: boolean) {
    let i = orderSelectedNames.value.length
    let nameToSet = `${orderAvailableNames.value[index]}.${asc ? 'A' : 'D'}`
    let paramKey = `Order By.ob${i + 1}`
    console.log(`paramClicked(${index}) nameToSet: ${nameToSet} indexToset: ${i} paramKey: ${paramKey}`)
    trio.setOrderByString(paramKey, nameToSet)
    selectedFilterParams.value.push(paramKey)
  }

  function orderClear() {
    let orderParamKeys = selectedFilterParams.value.filter(x => {
      return (x.split('.')[0] === 'Order By')
    })

    console.log(`orderClear currently selected #: ${orderParamKeys.length}`)
    orderParamKeys.forEach(x => {
      trio.setOrderByString(x, "")
      const i = selectedFilterParams.value.indexOf(x.slice(0, -2))
      selectedFilterParams.value.splice(i, 1)
    })
  }

  function filtersToQueryObject(): IObject {
    let query: IObject = {}
    selectedFilterParams.value.forEach(pk => {

      let pieces = pk.split('.')
      let groupKeyUnderlined = pieces[0].replace(/ /g, "_")
      let paramUnderlined = trio.trio.entities.params[pk].name.replace(/ /g, "_")

      if (query.hasOwnProperty(groupKeyUnderlined)) {
        query[groupKeyUnderlined] += ',' + paramUnderlined
      } else {
        query[groupKeyUnderlined] = paramUnderlined
      }
    })
    console.log(`filtersToQueryObject().query: ${JSON.stringify(query, null, 2)}`);
    return query
  }

  function urlQueryToFilters(qp: IObject): TParseUrlQueryResponse {
    console.log(`urlQueryToFilters().urlQuery: ${JSON.stringify(qp, null, 2)}`);
    let all: TApiFilters = {
      model_tag_ids: [],
      global_tag_ids: [],
      column_values: [],
      column_lookup_ids: [],
      column_search: [],
      bespoke: [],
      order_by: [],
    }
    let selectedFilters = <TSelectedFilterFromQuery[]>[]

    for (const [key, value] of Object.entries(qp)) {
      //Verify that the group exists. 
      let groupKey = key.replace(/_/g, " ")

      if (!trio.trio.entities.groups.hasOwnProperty(groupKey)) {
        console.log(`Query parsing Error: "${key}" group doesn't exist. aborting... `)
        throw 'BadGroupNameParsingError'
      }

      let group = trio.trio.entities.groups[groupKey]

      //verify that params exist for this group 
      let underlinedParams = <string[]>value.split(',')
      let params = underlinedParams.map(x => <string>x.replace(/_/g, " "))
      let possibleParams = group.params.map(x => {
        let pieces = x.split('.')
        return pieces[1]
      })

      //console.log(`key: ${groupKey}\nparams: ${params}\npossibleParams: ${possibleParams}\ngroup: ${JSON.stringify(group, null, 2)}`);

      switch (group.group_type_code) {
        case 'CS':
          //sanitize sql injections here
          params.forEach((x, index) => {
            selectedFilters.push({ param: group.group_name + '.term' + (index + 1), group_type_code: 'CS', extra: x })
          })
          //console.log(`group type 'CS' group: ${groupKey} params: ${JSON.stringify(params, null, 2)}`)
          break

        case 'OB':
          let orderGroup = <TGroupOrderBy>trio.trio.entities.groups['Order By']
          let options = orderGroup.options.map(x => x.name)

          params.forEach((x, index) => {
            if (!['.A', '.D'].includes(x.slice(-2))) {
              console.log(`Query parsing Error: "${x}" order param doesn't end with '.A' or '.D'. aborting... `)
              throw 'OrderByFormatParsingError'
            }
            if (!options.includes(x.slice(0, -2))) {
              console.log(`Query parsing Error: "${x}" param doesn't exist in group ${key}. aborting... `)
              throw 'OrderByBadNameParsingError'
            }
            selectedFilters.push({ param: group.group_name + '.ob' + (index + 1), group_type_code: 'OB', extra: x })
          })

          break
        default:
          params.forEach(x => {
            if (!possibleParams.includes(x)) {
              console.log(`Query parsing Error: "${x}" param doesn't exist in group ${key}. aborting... `)
              throw 'ParamNotInGroupParsingError'
            }
            selectedFilters.push({ param: group.group_name + '.' + x, group_type_code: group.group_type_code, extra: "" })
          })
      }

      //assign parameters to their correct 'filter' category
      switch (group.group_type_code) {
        case 'TG':
          all.global_tag_ids.push(...params.map(x => {
            let paramKey = groupKey + '.' + x
            return trio.trio.entities.params[paramKey].id
          }))
          break
        case 'TM':
          all.model_tag_ids.push(...params.map(x => {
            let paramKey = groupKey + '.' + x
            return trio.trio.entities.params[paramKey].id
          }))
          break
        case 'CL':
          all.column_lookup_ids.push({
            column_name: (<TGroupValue>trio.trio.entities.groups[groupKey]).column_name,
            vals: params.map(x => {
              let paramKey = groupKey + '.' + x
              return trio.trio.entities.params[paramKey].id
            })
          })
          break
        case 'CV':
        case 'CR':
          all.column_values.push({ column_name: (<TGroupValue>trio.trio.entities.groups[groupKey]).column_name, vals: params })
          break
        case 'CS':
          all.column_search.push({
            column_name: (<TGroupValue>trio.trio.entities.groups[groupKey]).column_name, vals: params
          })
          break
        case 'BF':
          switch (key) {
            case 'Media':
              all.bespoke.push({ name: key, vals: params })
              break

            case 'Area':
              all.bespoke.push({ name: key, vals: params })
              break
            default:
              console.log(`Query parsing Error: Unrecognized bespoke group ${key}. aborting... `)
              return {
                success: false,
                data: {
                  error: 'BadQueryParams',
                  message: `Query parsing Error: Unrecognized bespoke group ${key}. aborting... `
                }
              }
          }
          break

        case 'OB':
          console.log(`processing Order By group`)
          let orderGroup = <TGroupOrderBy>trio.trio.entities.groups['Order By']
          let options = orderGroup.options
          params.forEach(x => {
            let data = options.find(y => y.name === x.slice(0, -2));
            all.order_by.push({
              column_name: (<TGroupOrderByOptionObject>data).column_name, asc: x.slice(-1) === 'A'
            })
          })
      }
    }

    console.log(`urlQueryToFilters()\nquery: ${JSON.stringify(all, null, 2)}`);
    return { success: true, data: { apiFilters: all, selectedFilters } }
  }

  function addRemoveSearchParam(paramKey: string) {
    if (selectedFilterParams.value.some(x => x === paramKey)) {
      const i = selectedFilterParams.value.indexOf(paramKey)
      selectedFilterParams.value.splice(i, 1)
    } else {
      selectedFilterParams.value.push(paramKey)
    }
  }

  function clearSelectedFilters() {
    console.log(`filter.clearSelectedFilters()`)
    selectedFilterParams.value.forEach(x => {
      let pieces = x.split('.')
      switch (trio.trio.entities.groups[pieces[0]].group_type_code) {
        case 'OB':
          trio.setOrderByString(x, "")
        case 'CS':
          trio.setFilterSearchTerm(x, "")
        default:
        //nothing to do except remove from selectedFilters
      }
    })
    selectedFilterParams.value = []
  }

  function setFiltersFromUrlQuery(filters: TSelectedFilterFromQuery[]) {
    console.log(`filter.setFiltersFromUrlQuery()`)
    filters.forEach(x => {
      switch (x.group_type_code) {
        case 'OB':
          trio.setOrderByString(x.param, x.extra)
        case 'CS':
          trio.setFilterSearchTerm(x.param, x.extra)
        default:
          selectedFilterParams.value.push(x.param)
      }
    })
  }

  return {
    selectedFilterParams,
    orderAllNames,
    orderSelectedNames,
    orderAvailableNames,
    orderParamClicked,
    orderClear,
    filtersToQueryObject,
    urlQueryToFilters,
    addRemoveSearchParam,
    clearSelectedFilters,
    setFiltersFromUrlQuery
  }
})