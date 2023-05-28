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

  //index in visible categories
  let categoryIndex = ref<number>(0)

  //index in visible groups
  let groupIndex = ref<number>(0)


  //A category is visible if at least one of its groups is available 
  function visibleCategories(sourceName: TrioSourceName): TViewCategory[] {
    let cats: { catName: string, grpKeys: string[], cnt: number }[] = []
    let agk = availableGroupsKeys(sourceName)

    agk.forEach(x => {
      let group = trio.value.entities.groups[x]

      //count
      let selectedCount = groupSelectedParamsCnt(sourceName, x)
      console.log(`cnt: ${selectedCount}`)
      let i = cats.findIndex(x => x.catName === group.categoryKey)
      if (i === -1) {
        cats.push({ catName: group.categoryKey, grpKeys: [x], cnt: selectedCount })
      } else {
        cats[i].cnt += selectedCount
      }
    })
    const res = cats.map(x => { return { name: x.catName, visible: true, selectedCount: x.cnt } })
    //console.log(`visibleCategories: ${JSON.stringify(res, null, 2)}`)
    return res//cats.map(x => { return { name: x.catName, visible: true, selectedCount: x.cnt } })
  }

  function visibleCategoriesKeys(sourceName: TrioSourceName): string[] {
    let cats: string[] = []
    let agk = availableGroupsKeys(sourceName)

    agk.forEach(x => {
      let group = trio.value.entities.groups[x]
      let i = cats.findIndex(x => x === group.categoryKey)
      if (i === -1) {
        cats.push(group.categoryKey)
      }
    })
    return cats
  }

  //returns groups that belong to the currently selected category, and that are also available.
  //add counts
  function visibleGroups(sourceName: TrioSourceName): TViewGroup[] {
    if (trio.value.result.length === 0) { return [] }

    let vc = visibleCategoriesKeys(sourceName)
    let perCategoryGroupsKeys = trio.value.entities.categories[vc[categoryIndex.value]].groups

    //filter only available groups
    let visibleGroupsKeys = perCategoryGroupsKeys.filter(x => groupIsAvailable(sourceName, x))

    return visibleGroupsKeys.map(x => {
      let group = trio.value.entities.groups[x]
      return {
        name: x,
        groupKey: x,
        visible: true,
        selectedCount: groupSelectedParamsCnt(sourceName, x),
        params: group.params
      }
    })
  }

  function availableGroupsKeys(sourceName: TrioSourceName, onlySelected = false) {
    let agk = []
    for (const [key, value] of Object.entries(trio.value.entities.groups)) {
      if (onlySelected) {
        if (groupIsAvailable(sourceName, key) && (groupSelectedParamsCnt(sourceName, key) > 0)) {
          agk.push(key)
        }
      } else {
        if (groupIsAvailable(sourceName, key)) {
          agk.push(key)
        }
      }
    }
    return agk
  }

  //To be used by submit as the final selected groups and their params
  function groupsWithASelectedParam(sourceName: TrioSourceName): TmpGroup[] {
    if (trio.value.result.length === 0) { return [] }
    let selectedGroups = availableGroupsKeys(sourceName, true)

    return selectedGroups.map(x => {
      let group = trio.value.entities.groups[x]
      let params = group.params.map(p => {
        let pieces = p.split('.')
        return pieces[1]
      })
      return { groupName: x, params: params, categoryKey: group.categoryKey, selectedCount: groupSelectedParamsCnt(sourceName, x) }
    })
  }
  //Is group available?.
  //if source is filter, all groups are available.
  //if source is 'New' don't show TS (textual search). Check if group available for current item scope.
  //if TM ot TG check dependency.
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
    let vc = visibleCategoriesKeys(sourceName)
    let groupKeys = trio.value.entities.categories[vc[categoryIndex.value]].groups
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

  function groupSelectedParamsKeys(sourceName: TrioSourceName, groupKey: string) {
    let selectedKeys = selectedParamsKeysBySource(sourceName)
    return selectedKeys.filter(x => {
      let pieces = x.split('.')
      return pieces[0] === groupKey
    })
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
    let selectedGroupsKeys = availableGroupsKeys(sourceName, true)

    selectedGroupsKeys.forEach(gk => {
      let group = trio.value.entities.groups[gk]
      let params = groupSelectedParamsKeys(sourceName, gk).map(p => {
        let pieces = p.split('.')
        return pieces[1]
      })
      let i = catsWithGroups.findIndex(c => {
        return trio.value.entities.groups[gk].categoryKey === c.catName
      })

      let tmpGroup: TmpGroup = { groupName: gk, params, categoryKey: group.categoryKey, selectedCount: groupSelectedParamsCnt(sourceName, gk) }
      if (i === -1) {
        catsWithGroups.push({ catName: trio.value.entities.groups[gk].categoryKey, groups: [tmpGroup] })
      } else {
        catsWithGroups[i].groups.push(tmpGroup)
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

  //DEBUG only
  // const filterVisibleCategoriesKeys = computed(() => {
  //   let cats: string[] = []

  //   let availGrpsKeys = availableGroupsKeys("Filter")
  //   availGrpsKeys.forEach(x => {
  //     let g = trio.value.entities.groups[x]
  //     let i = cats.findIndex(x => x === g.categoryKey)
  //     if (i === -1) {
  //       cats.push(g.categoryKey)
  //     }
  //   })
  //   return cats
  // })

  // const filterVisibleGroupsKeys = computed(() => {
  //   let groupKeys = trio.value.entities.categories[filterVisibleCategoriesKeys.value[categoryIndex.value]].groups
  //   return groupKeys.filter(x => groupIsVisible("Filter", x))
  // })
  //END DEBUG

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
    selectedFilterParams,
    selectedItemParams,
    selectedNewItemParams,
    copyCurrentToNew,
    saveItemTags,
    groupsWithASelectedParam
    // filterVisibleCategoriesKeys,
    // filterVisibleGroupsKeys
  }
})