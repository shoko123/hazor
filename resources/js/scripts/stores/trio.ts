// stores/trio.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TGroupTag, TGroup, Trio, TrioSourceName, TmpGroup } from '../../types/trioTypes'
import { TApiItemShow, TApiItemUpdate } from '@/js/types/itemTypes'
import normalizeTrio from './trioNormalizer'

type TViewParam = { paramKey: string, id: number, name: string, selected: boolean }
type TViewGroup = { groupKey: string, name: string, visible: boolean, params: string[], selectedCount: number, required: boolean, multiple: boolean }
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
      let required = false
      let multiple = false
      switch (group.group_type_code) {
        case "CV":
        case "LV":
          required = true
          multiple = false
          break

        case "TM":
        case "TG":
          required = false
          multiple = (<TGroupTag>group).multiple
          break
          default:
            break
      }
      return {
        name: x,
        groupKey: x,
        visible: true,
        selectedCount: groupSelectedParamsCnt(sourceName, x),
        required,
        multiple,
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
        return parseParamKey(p)
      })
      return { groupName: x, params, categoryKey: group.categoryKey, selectedCount: groupSelectedParamsCnt(sourceName, x) }
    })
  }
  //Is group available?.
  //if source is filter, all groups are available.
  //if source is 'New' don't show CS (textual search). Check if group available for current item scope.
  //if TM ot TG check dependency.
  function groupIsAvailable(sourceName: TrioSourceName, groupKey: string) {
    let selectedParams = selectedParamsKeysBySource(sourceName)
    let g = trio.value.entities.groups[groupKey]

    if (sourceName === 'New' && ["CS", "BF"].includes(g.group_type_code)) {
      return false
    }

    if (["CS", "LV", "CV", "BF"].includes(g.group_type_code)) {
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
      let toAdd = (parseParamKey(param, false) === groupKey ? 1 : 0)
      return accumulator + toAdd
    }, 0);
    return selectedCount
  }

  function groupSelectedParamsNames(sourceName: TrioSourceName, groupKey: string) {
    let selectedKeys = selectedParamsKeysBySource(sourceName)
    return selectedKeys.filter(x => {
      return parseParamKey(x, false) === groupKey
    }).map(p => {
      return parseParamKey(p)
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
      let i = catsWithGroups.findIndex(c => {
        return trio.value.entities.groups[gk].categoryKey === c.catName
      })

      let tmpGroup: TmpGroup = { groupName: gk, params: groupSelectedParamsNames(sourceName, gk), categoryKey: group.categoryKey, selectedCount: groupSelectedParamsCnt(sourceName, gk) }
      if (i === -1) {
        catsWithGroups.push({ catName: group.categoryKey, groups: [tmpGroup] })
      } else {
        catsWithGroups[i].groups.push(tmpGroup)
      }
    })
    return catsWithGroups
  }

  function paramClicked(sourceName: TrioSourceName, groupIndex: number, paramIndex: number) {

    let visParams = visibleParams(sourceName)
    let paramInfo = visParams[paramIndex]
    let group = trio.value.entities.groups[parseParamKey(paramInfo.paramKey, false)]

    let selected = selectedParamsKeysBySource(sourceName)
    let selectedPerGroup = selected.filter(x => parseParamKey(x, false) === group.group_name)
    const isSelected = selected.includes(paramInfo.paramKey)
    console.log(`TRIO.click(${groupIndex}, ${paramIndex}): "${paramInfo.paramKey}"`)
    switch (sourceName) {
      case 'Filter':
        return paramFilterClicked(sourceName, paramInfo.paramKey, group, selected, isSelected)
      case 'New':
        return paramNewClicked(sourceName, paramInfo.paramKey, group, selected, isSelected)

      case 'Item':
        console.log("Error in param - source name is 'Item'")
    }
  }

  function paramFilterClicked(sourceName: TrioSourceName, paramKey: string, group: TGroup, selected: string[], isSelected: boolean) {
    console.log(`filterClicked() group_type_code: ${group.group_type_code}, isSelected: ${isSelected}\nall selected: [${selected}]`)
    if (isSelected) {
      flipParam(sourceName, paramKey, selected, false)
    } else {
      flipParam(sourceName, paramKey, selected, true)
    }
  }

  function paramNewClicked(sourceName: TrioSourceName, paramKey: string, group: TGroup, selected: string[], isSelected: boolean) {
    console.log(`NewClicked() group_type_code: ${group.group_type_code}, group name: ${group.group_name}, isSelected: ${isSelected}\nall selected: [${selected}]`)
    switch (group.group_type_code) {
      case "TG":
      case "TM":
        if ((<TGroupTag>group).multiple) {
          if (isSelected) {
            flipParam(sourceName, paramKey, selected, false)
          } else {
            flipParam(sourceName, paramKey, selected, true)
          }
        } else {
          if (isSelected) {
            flipParam(sourceName, paramKey, selected, false)
          } else {
            //if there is currently  a  selected one - unselect the currently selected and select the new one.
            //if there isn't, select the new one.
            const currentKey = selected.find(x => { return parseParamKey(x, false) === group.group_name })
            if (currentKey === undefined) {
              console.log("No param currently selected - selecting clicked")
              flipParam(sourceName, paramKey, selected, true)
              return
            }
            flipParam(sourceName, currentKey, selected, false)
            flipParam(sourceName, paramKey, selected, true)
          }
        }
        break

      case "LV":
      case "CV":
        if (isSelected) {
          //do nothing
        } else {
          //unselect the currently selected and select the new one
          const currentKey = selected.find(x => { return parseParamKey(x, false) === group.group_name })
          if (currentKey === undefined) {
            console.log("Error in paramNewClicked - can't find a selected param in current group, wrong group_type_code")
            return
          }
          flipParam(sourceName, currentKey, selected, false)
          flipParam(sourceName, paramKey, selected, true)

        }
        break
      default:
        console.log("Error in paramNewClicked - wrong group_type_code")
    }
  }
  function flipParam(sourceName: TrioSourceName, paramKey: string, selectedParams: string[], select: boolean) {
    if (select) {
      selectedParams.push(paramKey)
      selectedParams.sort((a, b) => { return trio.value.entities.params[a].order - trio.value.entities.params[b].order })
    } else {
      const i = selectedParams.indexOf(paramKey)
      selectedParams.splice(i, 1)
      clearDependecies(sourceName, paramKey)
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

    console.log(`Extra Groups to be unselectable: ${groupsToBeUnselectable.map(x => x.group_name)}`)

    //step 2 - collect all params to be unselected
    let paramsToBeUnselected: string[] = []
    groupsToBeUnselectable.forEach(x => {
      x.params.forEach(y => {
        if (selectedParams.includes(y)) {
          paramsToBeUnselected.push(y)
        }
      });
    })

    console.log(`Extra Params to be unselected: ${paramsToBeUnselected}`)

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

  function parseParamKey(paramKey: string, getParam = true) {
    let pieces = paramKey.split('.')
    return getParam ? pieces[1] : pieces[0]
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
          let group = trio.value.entities.groups[parseParamKey(x, false)]
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