// stores/trio.jsTGroupBase
import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import type { LocationQuery } from 'vue-router'
import type { TGroupBase, TGroupColumn } from '@/js/types/trioTypes'
import type { TApiFilters } from '@/js/types/routesTypes'
import type { IStringObject } from '@/js/types/generalTypes'
import type { TApiArrayMain } from '@/js/types/collectionTypes'
import { useTrioStore } from './trio'
import { useXhrStore } from '../xhr'
import { useRoutesMainStore } from '../routes/routesMain'

export const useFilterStore = defineStore('filter', () => {
  const { send } = useXhrStore()
  const { current } = storeToRefs(useRoutesMainStore())
  const { trio, groupLabelToKey, orderByAvailable, orderByGroup, orderByOptions, currentGroup } =
    storeToRefs(useTrioStore())
  const selectedFilterParams = ref<string[]>([])

  function filtersToQueryObject() {
    const q2: IStringObject = {}
    selectedFilterParams.value.sort((a, b) => {
      return a > b ? 1 : -1
    })
    selectedFilterParams.value.forEach((k) => {
      const paramUlined = trio.value.paramsObj[k].text.replace(/ /g, '_')
      const groupUlined = trio.value.groupsObj[trio.value.paramsObj[k].groupKey].label.replace(
        / /g,
        '_',
      )
      if (Object.prototype.hasOwnProperty.call(q2, groupUlined)) {
        q2[groupUlined] += ',' + paramUlined
      } else {
        q2[groupUlined] = paramUlined
      }
    })
    console.log(`filtersToQueryObject().q2: ${JSON.stringify(q2, null, 2)}`)
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

    if (trio.value.categories.length === 0) {
      return all
    }

    //push params into their correct arrays, according to group type
    selectedFilterParams.value.forEach((key) => {
      const param = trio.value.paramsObj[key]
      const group = trio.value.groupsObj[trio.value.paramsObj[key].groupKey]

      switch (group.code) {
        case 'CV':
        case 'CR':
          {
            const i = all.column_values.findIndex((x) => {
              return x.column_name === (<TGroupColumn>group).column_name
            })
            if (i === -1) {
              //if new group, push the param's group into the groups array with itself as the first param
              all.column_values.push({
                column_name: (<TGroupColumn>group).column_name,
                vals: [param.text],
              })
            } else {
              //if the group is already selected, add param's text to the group's params array
              all.column_values[i].vals.push(param.text)
            }
          }
          break

        case 'CL':
          {
            const i = all.column_lookup_ids.findIndex((x) => {
              return x.column_name === (<TGroupColumn>group).column_name
            })
            if (i === -1) {
              //if new group, push the param's group into the groups array with itself as the first param
              all.column_lookup_ids.push({
                column_name: (<TGroupColumn>group).column_name,
                vals: [<number>param.extra],
              })
            } else {
              //if the group is already selected, add param's text to the group's params array
              all.column_lookup_ids[i].vals.push(<number>param.extra)
            }
          }
          break

        case 'CB':
          {
            const i = all.column_values.findIndex((x) => {
              return x.column_name === (<TGroupColumn>group).column_name
            })
            if (i === -1) {
              //if new group, push the param's group into the groups array with itself as the first param
              all.column_values.push({
                column_name: (<TGroupColumn>group).column_name,
                vals: [<string>param.extra],
              })
            } else {
              //if the group is already selected, add param's text to the group's params array
              all.column_values[i].vals.push(<string>param.extra)
            }
          }
          break

        case 'CS':
          {
            const i = all.column_search.findIndex((x) => {
              return x.column_name === (<TGroupColumn>group).column_name
            })
            if (i === -1) {
              //if new group, push the param's group into the groups array with itself as the first param
              all.column_search.push({
                column_name: (<TGroupColumn>group).column_name,
                vals: [param.text],
              })
            } else {
              //if the group is already selected, add param's text to the group's params array
              all.column_search[i].vals.push(param.text)
            }
          }
          break
        case 'TM':
          {
            all.model_tag_ids.push(<number>param.extra)
          }
          break

        case 'TG':
          {
            all.global_tag_ids.push(<number>param.extra)
          }
          break

        case 'MD':
          {
            all.media.push(param.text)
          }
          break

        case 'OB':
          {
            const ordeByItem = orderByOptions.value.find((x) => x.name === param.text.slice(0, -2))
            all.order_by.push({
              column_name: <string>ordeByItem?.column_name,
              asc: param.text.slice(-1) === 'A',
            })
          }
          break
      }
    })
    return all
  })

  function urlQueryToApiFilters(
    qp: LocationQuery,
  ): { success: true } | { success: false; message: string } {
    //console.log(`urlQueryToApiFilters().urlQuery: ${JSON.stringify(qp, null, 2)}`);

    if (qp === null) {
      return { success: true }
    }
    for (const [key, value] of Object.entries(qp)) {
      if (value === null) {
        continue
      }

      console.log(
        `urlQueryEntry(${key}) =>: ${JSON.stringify((<string>value).split(','), null, 2)}`,
      )

      const undoUnderKey = key.replace(/_/g, ' ')
      if (undoUnderKey in groupLabelToKey.value === false) {
        return { success: false, message: `Unrecognized Url query parameter "${undoUnderKey}"` }
      }
      const group = trio.value.groupsObj[groupLabelToKey.value[undoUnderKey]]
      const paramTexts = (<string>value).split(',')
      switch (group.code) {
        case 'OB':
          {
            const res = processUrlOB(group, paramTexts)
            if (!res.success) {
              return res
            }
          }
          break

        case 'CS':
          {
            const res = processUrlCS(group, paramTexts)
            if (!res.success) {
              return res
            }
          }
          break

        default:
          {
            const res = processUrlDefault(
              group,
              paramTexts.map((x) => x.replace(/_/g, ' ')),
            )
            if (!res.success) {
              return res
            }
          }
          break
      }
    }

    return { success: true }
  }

  function processUrlDefault(
    group: TGroupBase,
    paramTexts: string[],
  ): { success: true } | { success: false; message: string } {
    for (const x of paramTexts) {
      const i = group.paramKeys.findIndex((y) => trio.value.paramsObj[y].text === x)
      if (i === -1) {
        return {
          success: false,
          message: `*** Url option "${x}" is illegal for parameter "${group.label}".`,
        }
      }
      selectedFilterParams.value.push(group.paramKeys[i])
    }
    return { success: true }
  }

  function processUrlOB(
    group: TGroupBase,
    paramTexts: string[],
  ): { success: true } | { success: false; message: string } {
    const selected: string[] = []
    for (const x of paramTexts) {
      const nameOnly = x.slice(0, -2)
      const lastTwo = x.substring(x.length - 2)

      if (selected.some((y) => y === nameOnly)) {
        return { success: false, message: `Duplicate url Order By parameter "${nameOnly}".` }
      }

      const ordeByIndex = orderByOptions.value.findIndex((y) => y.name === nameOnly)

      if (ordeByIndex === undefined || (lastTwo !== '.A' && lastTwo !== '.D')) {
        return { success: false, message: `Unrecognized url Order By parameter "${x}".` }
      }

      const firstEmptyParamKey = group.paramKeys.find((x) => trio.value.paramsObj[x].text === '')
      if (firstEmptyParamKey === undefined) {
        return { success: false, message: `Problem with url Order By parameter "${x}".` }
      }
      trio.value.paramsObj[firstEmptyParamKey].text = x
      selectedFilterParams.value.push(firstEmptyParamKey)
      selected.push(nameOnly)
    }
    return { success: true }
  }

  function processUrlCS(
    group: TGroupBase,
    paramTexts: string[],
  ): { success: true } | { success: false; message: string } {
    if (paramTexts.length > 6) {
      return {
        success: false,
        message: `Url query problem: Too many search terms for parameter "${group.label}".`,
      }
    }
    for (const x of paramTexts) {
      const firstEmptyParamKey = group.paramKeys.find((x) => trio.value.paramsObj[x].text === '')
      if (firstEmptyParamKey === undefined) {
        return { success: false, message: `Problem with url search parameter "${x}".` }
      }
      trio.value.paramsObj[firstEmptyParamKey].text = x
      selectedFilterParams.value.push(firstEmptyParamKey)
    }
    return { success: true }
  }

  function clearSelectedFilters() {
    console.log(`filter.clearSelectedFilters()`)
    for (const value of Object.values(groupLabelToKey.value)) {
      if (trio.value.groupsObj[value].code === 'CS') {
        trio.value.groupsObj[value].paramKeys.forEach((x) => {
          trio.value.paramsObj[x].text = ''
          trio.value.paramsObj[x].extra = null
        })
      }
    }
    orderByClear()
    selectedFilterParams.value = []
  }

  async function getCount() {
    const res = await send<TApiArrayMain[]>('model/index', 'post', {
      model: current.value.module,
      query: apiQueryPayload.value,
    })
    return res.success ? res.data.length : -1
  }

  const textSearchParamKeys = computed(() => {
    return (<TGroupBase>currentGroup.value).paramKeys
  })

  function searchTextChanged(index: number, val: string) {
    const paramKey = textSearchParamKeys.value[index]
    //console.log(`changeOccured() index: ${index} setting param with key ${paramKey} to: ${val}`)
    trio.value.paramsObj[paramKey].text = val

    //add/remove from selected filters
    const inSelected = selectedFilterParams.value.includes(paramKey)
    if (inSelected && val === '') {
      const i = selectedFilterParams.value.indexOf(paramKey)
      selectedFilterParams.value.splice(i, 1)
    }
    if (!inSelected && val !== '') {
      selectedFilterParams.value.push(paramKey)
    }
  }

  function searchTextClearCurrent() {
    console.log(`clear()`)
    textSearchParamKeys.value.forEach((x) => {
      trio.value.paramsObj[x].text = ''

      //if currently in selectedFilters, then remove.
      if (selectedFilterParams.value.includes(x)) {
        const i = selectedFilterParams.value.indexOf(x)
        selectedFilterParams.value.splice(i, 1)
      }
    })
  }

  //order by
  ///////////

  function orderParamClicked(index: number, asc: boolean) {
    const orderByParams = orderByGroup.value?.paramKeys.map((x) => {
      return { ...trio.value.paramsObj[x], key: x }
    })

    if (orderByParams === undefined) {
      console.log(`serious error - abort *********`)
      return
    }

    const firstEmptyParam = orderByParams.find((x) => x.text === '')
    if (firstEmptyParam === undefined) {
      console.log(`serious error - abort *********`)
      return
    }

    const label = `${orderByAvailable.value[index].name}.${asc ? 'A' : 'D'}`
    // console.log(`paramClicked(${index}) asc: ${asc} params:  ${JSON.stringify(orderByParams, null, 2)} key: ${firstEmptyParam.key} label: ${label}`)

    trio.value.paramsObj[firstEmptyParam.key].text = label
    selectedFilterParams.value.push(firstEmptyParam.key)
  }

  function orderByClear() {
    console.log(`orderClear`)
    orderByGroup.value?.paramKeys.forEach((x) => {
      trio.value.paramsObj[x].text = ''
      if (selectedFilterParams.value.includes(x)) {
        const i = selectedFilterParams.value.indexOf(x)
        selectedFilterParams.value.splice(i, 1)
      }
    })
  }
  return {
    selectedFilterParams,
    apiQueryPayload,
    orderParamClicked,
    orderByClear,
    filtersToQueryObject,
    urlQueryToApiFilters,
    clearSelectedFilters,
    getCount,
    searchTextChanged,
    searchTextClearCurrent,
  }
})
