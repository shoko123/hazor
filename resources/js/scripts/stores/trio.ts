// stores/trio.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TGroupTag, Trio, TrioSourceName, TmpGroup } from '../../types/trioTypes'
import { TApiItemShow, TApiItemUpdate } from '@/js/types/itemTypes'
import normalizeTrio from './trioNormalizer'

type TViewParam = { paramKey: string, id: number, name: string, selected: boolean }
type TViewGroup = { groupKey: string, name: string, visible: boolean, params: string[], selectedCount: number }
type TViewCategory = { name: string, visible: boolean, selectedCount: number }

export const useTrioStore = defineStore('trio', () => {
  let trio = ref<Trio>({
    entities: {
      categories: {},
      groups: {},
      params: {}
    }, result: []
  })

  //The format of all selectedParams is the string 'groupName.ParamName'.
  //The string format allows for easier assignment and review of dependencies (rather than ids).
  //It also allows for repeated param strings under different groups.
  //It treats all groups, regardless of type [global/module tag, lookup, column discreate values, various bespoke filters],
  //in the same way.
  let selectedFilterParams = ref<string[]>([])
  let selectedItemParams = ref<string[]>([])
  let selectedNewItemParams = ref<string[]>([])

  //index in visibleCategories
  let categoryIndex = ref<number>(0)

  //index in visibleGroups
  let groupIndex = ref<number>(0)


  //A category is visible if at least one of its groups is available 
  function visibleCategories(sourceName: TrioSourceName): TViewCategory[] {
    let cats: { catName: string, grpKeys: string[], cnt: number }[] = []
    let agk = availableGroupsKeys(sourceName)

    agk.forEach(x => {
      let selectedKeys = selectedParamsKeysBySource(sourceName)
      let group = trio.value.entities.groups[x]

      //count
      let selectedCount = selectedKeys.reduce((accumulator, gk) => {
        return accumulator + groupSelectedParamsCnt(sourceName, gk)
      }, 0);

      let i = cats.findIndex(x => x.catName === group.categoryKey)
      if (i === -1) {
        cats.push({ catName: group.categoryKey, grpKeys: [x], cnt: selectedCount })
      } else {
        cats[i].cnt += selectedCount
      }
    })
    return cats.map(x => { return { name: x.catName, visible: true, selectedCount: x.cnt } })
  }

  //DEBUG only
  const filterVisibleCategoriesKeys = computed(() => {
    let cats: string[] = []

    let availGrpsKeys = availableGroupsKeys("Filter")
    availGrpsKeys.forEach(x => {
      let g = trio.value.entities.groups[x]
      let i = cats.findIndex(x => x === g.categoryKey)
      if (i === -1) {
        cats.push(g.categoryKey)
      }
    })
    return cats
  })

  const filterVisibleGroupsKeys = computed(() => {
    let groupKeys = trio.value.entities.categories[filterVisibleCategoriesKeys.value[categoryIndex.value]].groups
    //let vc = visibleCategories(sourceName)
    //et groupKeys = trio.value.entities.categories[vc[categoryIndex.value].name].groups

    return groupKeys.filter(x => groupIsVisible("Filter", x))
  })
  //END DEBUG


  function groupsWithASelectedParam(sourceName: TrioSourceName): TmpGroup[] {
    if (trio.value.result.length === 0) { return [] }
    let groups: TmpGroup[] = []
    let selectedParams = selectedParamsKeysBySource(sourceName)

    selectedParams.forEach(x => {
      let pieces = x.split('.')
      let group = pieces[0]
      let param = pieces[1]

      let i = groups.findIndex(x => x.groupName === group)
      if (i === -1) {
        let params: string[] = [param]
        groups.push({ groupName: group, params: params, categoryKey: trio.value.entities.groups[group].categoryKey, selectedCount: 1 })
      } else {
        groups[i].params.push(param)
        groups[i].selectedCount++
      }
    })
    return groups
  }

  function visibleGroups(sourceName: TrioSourceName): TViewGroup[] {
    if (trio.value.result.length === 0) { return [] }
    let vc = visibleCategories(sourceName)
    let groupKeys = trio.value.entities.categories[vc[categoryIndex.value].name].groups

    let selected = groupsWithASelectedParam(sourceName)
    let agks = availableGroupsKeys(sourceName)

    //console.log(`visibleGroups().availableGroupsKeys: ${JSON.stringify(agks, null, 2)}`)
    let allGroupsPerCategory = groupKeys.map(x => {
      let group = trio.value.entities.groups[x]
      let index = selected.findIndex(y => y.groupName === group.group_name)
      let selectedCount = index === -1 ? 0 : selected[index].selectedCount

      return {
        name: trio.value.entities.groups[x].group_name,
        groupKey: x,
        visible: agks.includes(group.group_name),
        selectedCount,
        params: trio.value.entities.groups[x].params
      }
    })

    //filter
    return allGroupsPerCategory.filter(x => x.visible)
  }


  function availableGroupsKeys(sourceName: TrioSourceName) {
    let agk = []
    for (const [key, value] of Object.entries(trio.value.entities.groups)) {
      if (groupIsAvailable(sourceName, key)) {
        agk.push(key)
      }
    }
    return agk
  }

  //if group has a dependency, check if met.
  //if source is filter, available
  //if source is 'New' don't show TS (textual search). If TM ot TG check dependancy
  function groupIsAvailable(sourceName: TrioSourceName, groupKey: string) {
    let selectedParams = selectedParamsKeysBySource(sourceName)
    let g = trio.value.entities.groups[groupKey]

    if (g.group_type_code === 'TS' && sourceName === 'New') {
      return false
    }

    if (["TS", "LV", "CV"].includes(g.group_type_code)) {
      return true
    }

    let tagGroup = <TGroupTag>g
    return tagGroup.dependency === null ||
      tagGroup.dependency.some(x => {
        return (selectedParams.includes(x))
      })
  }

  function groupIsVisible(sourceName: TrioSourceName, groupKey: string) {
    let vc = visibleCategories(sourceName)
    let groupKeys = trio.value.entities.categories[vc[categoryIndex.value].name].groups

    return groupKeys.includes(groupKey) && groupIsAvailable(sourceName, groupKey)
  }

  function groupSelectedParamsCnt(sourceName: TrioSourceName, groupKey: string) {
    let selectedKeys = selectedParamsKeysBySource(sourceName)
    let selectedCount = selectedKeys.reduce((accumulator, param) => {
      let pieces = param.split('.')
      let toAdd = (pieces[0] === groupKey ? 1 : 0)
      return accumulator + toAdd
    }, 0);
    return selectedCount
  }

  function visibleParams(sourceName: TrioSourceName): TViewParam[] {
    if (trio.value.result.length === 0) { return [] }
    let visGroups = visibleGroups(sourceName)
    let selected = selectedParamsKeysBySource(sourceName)


    let paramKeys = visGroups[groupIndex.value].params
    return paramKeys.map(x => { return { ...trio.value.entities.params[x], selected: selected.includes(x) } })
  }

  function selectedParamsKeysBySource(sourceName: TrioSourceName): string[] {
    return sourceName === 'Item' ?
      selectedItemParams.value :
      (sourceName === 'New' ? selectedNewItemParams.value : selectedFilterParams.value)
  }

  function selectedTrio(sourceName: TrioSourceName) {
    if (trio.value.result.length === 0) { return [] }
    //Assign each "selected" group to a category
    let catsWithGroups: { catName: string, groups: TmpGroup[] }[] = []

    let groups = groupsWithASelectedParam(sourceName)
    groups.forEach(g => {
      let i = catsWithGroups.findIndex(y => {
        return trio.value.entities.groups[g.groupName].categoryKey === y.catName
      })

      if (i === -1) {
        catsWithGroups.push({ catName: trio.value.entities.groups[g.groupName].categoryKey, groups: [g] })
      } else {
        catsWithGroups[i].groups.push(g)
      }
    })
    return catsWithGroups
  }

  function paramClicked(sourceName: TrioSourceName, groupIndex: number, paramIndex: number) {
    console.log(`TRIO.paramClicked() GroupIndex ${groupIndex}: ParamIndex: ${paramIndex} clicked`)

    let visParams = visibleParams(sourceName)
    let paramInfo = visParams[paramIndex]

    let selectedParams = selectedParamsKeysBySource(sourceName)
    let i = selectedParams.findIndex((x) => x === paramInfo.paramKey)
    if (i === -1) {
      selectedParams.push(paramInfo.paramKey)
      selectedParams.sort((a, b) => { return trio.value.entities.params[a].order - trio.value.entities.params[b].order })
    } else {
      selectedParams.splice(i, 1)
      clearDependecies(sourceName, paramInfo.paramKey)
    }
  }

  //When unselecting a param, we must check and possibly unselect dependencies.
  function clearDependecies(sourceName: TrioSourceName, paramKey: string) {
    console.log(`clearDependecies param: ${paramKey}`)
    //We assume that this param was already removed from paramClickedSource (selectedFilterParams/selectedNewItemParams).

    let selectedParams = selectedParamsKeysBySource(sourceName)

    //step 1 - collect all affected groups by unselecting this param
    let groupsToBeUnselectable: TGroupTag[] = []
    for (const [key, value] of Object.entries(trio.value.entities.groups)) {
      //only Tag groups may be dependent
      if (!["TG", "TM"].includes(value.group_type_code)) {
        continue
      }

      //collect only those whose dependency includes paramKey
      let group = <TGroupTag>value
      if (group.dependency === null || !group.dependency.includes(paramKey)) {
        continue
      }

      //check if dependency holds or not
      let groupIstoBeUnselected = !group.dependency.some(x => {
        return (selectedParams.includes(x))
      })

      if (groupIstoBeUnselected) {
        //console.log(`Pushing Group ${group.group_name} to groupsToBeUnselectable`);
        groupsToBeUnselectable.push(group)
      }
    }

    console.log(`Groups to be unselectable: ${groupsToBeUnselectable.map(x => x.group_name)}`)

    //step 2 - collect all params to be unselected
    let paramsToBeUnselected: string[] = []
    groupsToBeUnselectable.forEach(x => {
      x.params.forEach(y => {
        if (selectedParams.includes(y)) {
          paramsToBeUnselected.push(y)
        }
      });
    })

    console.log(`Params to be unselected: ${paramsToBeUnselected}`)

    //step 3 - for each paramsToBeUnselected - remove from selected, call clearDependecies() recuresively
    paramsToBeUnselected.forEach(x => {
      let i = selectedParams.findIndex((y) => y === x)
      if (i === -1) {
        console.log(`ERRRRR - trying to remove param ${x} which is NOT selected`)
      } else {
        selectedParams.splice(i, 1)
        clearDependecies(sourceName, x)
      }
    })
  }

  function setTrio(res: object) {
    trioReset()
    trio.value = normalizeTrio(res);
  }

  function saveItemTags(modelTags: string[], globalTags: string[], discrete_columns: string[]) {
    //verify that each of group.param[] exists [for this module/group] and save them
    selectedItemParams.value = [...modelTags, ...globalTags, ...discrete_columns]
  }

  function trioReset() {
    selectedItemParams.value = []
    selectedNewItemParams.value = []
    selectedFilterParams.value = []
    groupIndex.value = 0
    categoryIndex.value = 0
    trio.value.result.length = 0
    trio.value = {
      entities: {
        categories: {},
        groups: {},
        params: {}
      }, result: []
    }
  }

  function copyCurrentToNew() {
    selectedNewItemParams.value = [...selectedItemParams.value]
  }

  function clearSelected(sourceName: TrioSourceName) {
    groupIndex.value = 0
    categoryIndex.value = 0
    switch (sourceName) {
      case 'Filter':
        selectedFilterParams.value = []
        break

      case 'New':
        const resetParams: string[] = []
        selectedNewItemParams.value.forEach(x => {
          let pieces = x.split('.')
          let group = trio.value.entities.groups[pieces[0]]
          if (["LV", "CV"].includes(group.group_type_code)) {
            resetParams.push(group.params[0])
          }
        })
        selectedNewItemParams.value = resetParams
        break

      case 'Item':
        selectedItemParams.value = []
        break
    }
  }

  return {
    clearSelected,
    paramClicked,
    setTrio,
    trioReset,
    selectedTrio,
    visibleCategories,
    visibleGroups,
    visibleParams,
    trio,
    categoryIndex,
    groupIndex,
    groupsWithASelectedParam,
    selectedFilterParams,
    selectedItemParams,
    selectedNewItemParams,
    copyCurrentToNew,
    saveItemTags,
    filterVisibleCategoriesKeys,
    filterVisibleGroupsKeys
  }
})