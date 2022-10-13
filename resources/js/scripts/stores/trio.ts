// stores/trio.js
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useRoutesStore } from './routes/routesMain'
import { TGroupTag, Trio, TrioSourceName } from '../../types/trioTypes'

import normalizeTrio from './trioNormalizer'

type TViewParam = { paramKey: string, id: number, name: string, selected: boolean }
type TViewGroup = { groupKey: string, name: string, visible: boolean, params: string[], selectedCount: number }
type TViewCategory = { name: string, visible: boolean, selectedCount: number }
type TmpGroup = { groupName: string, params: string[], selectedCount: number }

export const useTrioStore = defineStore('trio', () => {
  const { current } = storeToRefs(useRoutesStore())

  let trio = ref<Trio>({
    entities: {
      categories: {},
      groups: {},
      params: {}
    }, result: []
  })

  let selectedFilterParams = ref<string[]>([])
  let selectedItemParams = ref<string[]>([])
  let selectedNewItemParams = ref<string[]>([])

  let selectedGroupIndex = ref<number>(0)
  let selectedCategoryIndex = ref<number>(0)

  const module = computed(() => {
    return current.value.module
  })

  //Public facing API to be consumed by TagForm
  const selectedFilters = computed(() => {
    let groups: TmpGroup[] = []

    selectedFilterParams.value.forEach(x => {
      let pieces = x.split('.')
      let group = pieces[0]
      let param = pieces[1]

      let i = groups.findIndex(x => x.groupName === group)
      if (i === -1) {
        let params: string[] = [param]
        groups.push({ groupName: group, params: params, selectedCount: 1 })
      } else {
        groups[i].params.push(param)
        groups[i].selectedCount++
      }
    })
    return groups
  })

  function getSource(sourceName: TrioSourceName) {
    return sourceName === 'Item' ?
      selectedItemParams : (sourceName === 'New' ? selectedNewItemParams :  selectedFilterParams)
  }

  function selectedParamGroups(sourceName: TrioSourceName): TmpGroup[] {
    let groups: TmpGroup[] = []
    let source = getSource(sourceName)

    //source.value.forEach(x => {
    source?.value.forEach(x => {
      let pieces = x.split('.')
      let group = pieces[0]
      let param = pieces[1]

      let i = groups.findIndex(x => x.groupName === group)
      if (i === -1) {
        let params: string[] = [param]
        groups.push({ groupName: group, params: params, selectedCount: 1 })
      } else {
        groups[i].params.push(param)
        groups[i].selectedCount++
      }
    })
    return groups
  }

  //Public facing API to be consumed by TagForm
  const selectedFiltersTrio = computed(() => {

    //Assign each "selected" group to a category
    let catsWithGroups: { catName: string, groups: TmpGroup[] }[] = []

    let groups = selectedParamGroups('Filter')
    groups.forEach(g => {
      //selectedFilters.value.forEach(g => {
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
  })

  function selectedTrio(sourceName: TrioSourceName) {
    //Assign each "selected" group to a category
    let catsWithGroups: { catName: string, groups: TmpGroup[] }[] = []

    let groups = selectedParamGroups(sourceName)
    groups.forEach(g => {
      //selectedFilters.value.forEach(g => {
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

   //A category is visible if at least one of its groups is viewable 
   function visibleCats (sourceName: TrioSourceName) : TViewCategory[]{
    let allCategories = trio.value.result.map(x => {
      let category = trio.value.entities.categories[x]
      let selected = selectedParamGroups(sourceName)
      //sum the  counts of all selected params (per category)
      let selectedCount = category.groups.reduce((accumulator, groupKey) => {
        let index = selected.findIndex(y => y.groupName === groupKey)
        let toAdd = index === -1 ? 0 : selected[index].selectedCount
        return accumulator + toAdd
      }, 0);

      //is category visible?
      let visible = category.groups.some(y => {
        return activeGroups.value.includes(y)
      })
      return { name: category.name, visible, selectedCount }
    })

    //filter
    return allCategories.filter(x => x.visible)
  }

  //A group is visible if it belongs to the currently selected category,
  //and is active - its dependency conditions are met.
  const visibleGroups = computed<TViewGroup[]>(() => {
    if (trio.value.result.length === 0) { return [] }
    let groupKeys = <string[]>trio.value.entities.categories[trio.value.result[selectedCategoryIndex.value]].groups
    let allGroupsPerCategory = groupKeys.map(x => {
      let group = trio.value.entities.groups[x]
      let index = selectedFilters.value.findIndex(y => y.groupName === group.group_name)
      let selectedCount = index === -1 ? 0 : selectedFilters.value[index].selectedCount

      return {
        name: trio.value.entities.groups[x].group_name,
        groupKey: x,
        visible: activeGroups.value.includes(group.group_name),
        selectedCount,
        params: trio.value.entities.groups[x].params
      }
    })

    //filter
    return allGroupsPerCategory.filter(x => x.visible)
  })

  function visibleGrps(sourceName: TrioSourceName) : TViewGroup[] {
    if (trio.value.result.length === 0) { return [] }
    let groupKeys = <string[]>trio.value.entities.categories[trio.value.result[selectedCategoryIndex.value]].groups

    let selected = selectedParamGroups(sourceName)

    let allGroupsPerCategory = groupKeys.map(x => {
      let group = trio.value.entities.groups[x]
      let index = selected.findIndex(y => y.groupName === group.group_name)
      let selectedCount = index === -1 ? 0 : selected[index].selectedCount

      return {
        name: trio.value.entities.groups[x].group_name,
        groupKey: x,
        visible: activeGroups.value.includes(group.group_name),
        selectedCount,
        params: trio.value.entities.groups[x].params
      }
    })

    //filter
    return allGroupsPerCategory.filter(x => x.visible)
  }

  // All groups whose dependency conditions are met.
  const activeGroups = computed<string[]>(() => {
    let activeGroups: string[] = []
    for (const [key, value] of Object.entries(trio.value.entities.groups)) {
      if (!["TG", "TM"].includes(value.group_type_code)) {
        activeGroups.push(value.group_name)
        continue
      }
      let tagGroup = <TGroupTag>value
      if (tagGroup.dependency === null || tagGroup.dependency.some(x => {
        return (selectedFilterParams.value.includes(x))
      })) {
        activeGroups.push(value.group_name)
        continue
      }
    }
    return activeGroups
  })

  //Params of the currently selected category/group
  const visibleParams = computed<TViewParam[]>(() => {
    if (trio.value.result.length === 0) { return [] }
    let paramKeys = visibleGroups.value[selectedGroupIndex.value].params
    return paramKeys.map(x => { return { ...trio.value.entities.params[x], selected: selectedFilterParams.value.includes(x) } })
  })

 function visiblePars(sourceName: TrioSourceName) : TViewParam[] {
    if (trio.value.result.length === 0) { return [] }
    let visibleGoups = visibleGrps(sourceName)
    let selected = getSource(sourceName)
    let paramKeys = visibleGroups.value[selectedGroupIndex.value].params
    return paramKeys.map(x => { return { ...trio.value.entities.params[x], selected: selected?.value.includes(x) } })
  }

  function setTrio(res: object) {
    resetTrio()
    trio.value = normalizeTrio(res);
  }

  function paramClicked(sourceName: TrioSourceName, groupIndex: number, paramIndex: number) {
    console.log(`TRIO.paramClicked() GroupIndex ${groupIndex}: ParamIndex: ${paramIndex} clicked`)
    
    let visibleGroupItem = visibleGroups.value[groupIndex]
    let groupInfo = trio.value.entities.groups[visibleGroupItem.groupKey]
    let paramInfo = visibleParams.value[paramIndex]

    let selectedParams = getSource(sourceName)
    let i = selectedParams.value.findIndex((x) => x === paramInfo.paramKey)
    if (i === -1) {
      selectedParams.value.push(paramInfo.paramKey)
      selectedParams.value.sort((a, b) => { return trio.value.entities.params[a].order - trio.value.entities.params[b].order })
    } else {
      selectedParams.value.splice(i, 1)
      clearDependecies(paramInfo.paramKey)
    }
  }

  //When unselecting a param, we must check and possibly unselect dependencies.
  function clearDependecies(paramKey: string) {
    console.log(`clearDependecies param: ${paramKey}`)
    //We assume that this param was already removed from paramClickedSource (selectedFilterParams/selectedNewItemParams).

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
        return (selectedFilterParams.value.includes(x))
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
        if (selectedFilterParams.value.includes(y)) {
          paramsToBeUnselected.push(y)
        }
      });
    })

    console.log(`Params to be unselected: ${paramsToBeUnselected}`)

    //step 3 - for each paramsToBeUnselected - remove from selected, call clearDependecies() recuresively
    //decide which selected array to use according to current router path name
    let selected = (current.value.name === 'filter') ? selectedFilterParams.value : selectedNewItemParams.value

    paramsToBeUnselected.forEach(x => {
      let i = selected.findIndex((y) => y === x)
      if (i === -1) {
        console.log(`ERRRRR - trying to remove param ${x} which is NOT selected`)
      } else {
        selected.splice(i, 1)
        clearDependecies(x)
      }
    })
  }

  function resetTrio() {
    selectedGroupIndex.value = 0
    selectedCategoryIndex.value = 0
    trio.value.result.length = 0
    trio.value = {
      entities: {
        categories: {},
        groups: {},
        params: {}
      }, result: []
    }
  }

  function initFilters() {
    for (const [key, value] of Object.entries(trio.value.entities.groups)) {
      //console.log(`${key}: ${value}`);
      //groupsFilter.value.push(key)
    }
  }

  function clearFilters() {
    selectedGroupIndex.value = 0
    selectedCategoryIndex.value = 0
    selectedFilterParams.value = []
  }

  return { clearFilters, paramClicked, setTrio, selectedTrio, visibleCats, visibleGrps, visiblePars, trio, selectedCategoryIndex, selectedGroupIndex }
})