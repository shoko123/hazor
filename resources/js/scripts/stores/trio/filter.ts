// stores/trio.js
import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'

import type { TGroupValue,  } from '../../../types/trioTypes'
import type { IObject } from '../../../types/generalTypes'
import type { TParseUrlQueryResponse, TParseQueryData } from '@/js/types/routesTypes'
import { useTrioStore } from './trio'

export const useFilterStore = defineStore('filter', () => {
  const { selectedFilterParams, trio, } = storeToRefs(useTrioStore())

  function filtersToQueryObject(): IObject {
    let query: IObject = {}
    selectedFilterParams.value.forEach(pk => {

      let pieces = pk.split('.')
      let groupKeyUnderlined = pieces[0].replace(/ /g, "_")
      let paramUnderlined = pieces[1].replace(/ /g, "_")

      if (query.hasOwnProperty(groupKeyUnderlined)) {
        query[groupKeyUnderlined] += ',' + paramUnderlined
      } else {
        query[groupKeyUnderlined] = paramUnderlined
      }
    })
    console.log(`filtersToQueryObject().query: ${JSON.stringify(query, null, 2)}`);
    return query
  }

  function urlQueryObjectToApiFilters(qp: IObject): TParseUrlQueryResponse {
    console.log(`urlQueryObjectToApiFilters().urlQuery: ${JSON.stringify(qp, null, 2)}`);
    let all: TParseQueryData = {
      model_tag_ids: [],
      global_tag_ids: [],
      column_values: [],
      column_lookup_ids: [],
      column_search: [],
      bespoke: []
    }

    for (const [key, value] of Object.entries(qp)) {
      //Verify that the group exists. 
      let groupKey = key.replace(/_/g, " ")

      if (!trio.value.entities.groups.hasOwnProperty(groupKey)) {
        console.log(`Query parsing Error: "${key}" group doesn't exist. aborting... `)
        return {
          success: false,
          data: {
            error: 'BadQueryParams',
            message: `Query parsing Error: "${key}" group doesn't exist. aborting... `
          }
        }
      }
      let group = trio.value.entities.groups[groupKey]

      //verify that params exist for this group 
      let underlinedParams = <string[]>value.split(',')
      let params = underlinedParams.map(x => <string>x.replace(/_/g, " "))
      let possibleParams = group.params.map(x => {
        let pieces = x.split('.')
        return pieces[1]
      })
      //console.log(`key: ${groupKey}\nparams: ${params}\npossibleParams: ${possibleParams}\ngroup: ${JSON.stringify(group, null, 2)}`);

      params.forEach(x => {
        if (group.group_type_code !== 'CS') {
          if (!possibleParams.some(y => y === x)) {
            console.log(`Query parsing Error: "${x}" param doesn't exist in group ${key}. aborting... `)
            return {
              success: false,
              data: {
                error: 'BadQueryParams',
                message: `Query parsing Error: "${x}" param doesn't exist in group ${key}. aborting... `
              }
            }
          }
        }
      })

      console.log(`passed group+params existence`)

      //assign parameters to their correct 'filter' category
      switch (group.group_type_code) {
        case 'TG':
          all.global_tag_ids.push(...params.map(x => {
            let paramKey = groupKey + '.' + x
            return trio.value.entities.params[paramKey].id
          }))
          break
        case 'TM':
          all.model_tag_ids.push(...params.map(x => {
            let paramKey = groupKey + '.' + x
            return trio.value.entities.params[paramKey].id
          }))
          break
        case 'CL':
          all.column_lookup_ids.push({
            column_name: (<TGroupValue>trio.value.entities.groups[groupKey]).column_name,
            vals: params.map(x => {
              let paramKey = groupKey + '.' + x
              return trio.value.entities.params[paramKey].id
            })
          })
          break
        case 'CV':
        case 'CR':
          all.column_values.push({ column_name: (<TGroupValue>trio.value.entities.groups[groupKey]).column_name, vals: params })
          break
        case 'CS':
          all.column_search.push({ column_name: (<TGroupValue>trio.value.entities.groups[groupKey]).column_name, vals: params })
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
      }
    }

    console.log(`urlQueryObjectToApiFilters()\nquery: ${JSON.stringify(all, null, 2)}`);
    return { success: true, data: all }
  }

  function addRemoveSearchParam(paramKey: string) {
    if (selectedFilterParams.value.some(x => x === paramKey)) {
      const i = selectedFilterParams.value.indexOf(paramKey)
      selectedFilterParams.value.splice(i, 1)
    } else {
      selectedFilterParams.value.push(paramKey)
    }
  }

  function setFilterSearchTerm(paramKey: string, searchTerm: string) {
    console.log(`setFilterSearchTerm(${paramKey}, ${searchTerm})`)
    trio.value.entities.params[paramKey].name = searchTerm
  }

  return {
    selectedFilterParams,
    filtersToQueryObject,
    urlQueryObjectToApiFilters,
    setFilterSearchTerm,
    addRemoveSearchParam,
  }
})