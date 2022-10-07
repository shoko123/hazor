// stores/media.js
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useRoutesStore } from './routes/routesMain'
import { TGroupTag, Trio, TSelectedParam } from '../../types/trioTypes'

import normalizeTrio from './trioNormalizer'

type TViewableParam = { id: number, name: string, selected: boolean }
type TViewableGroup = { groupKey: string, name: string, visible: boolean, params: string[] }
type TViewableCategory = { name: string, visible: boolean }

type TViewParam = { paramKey: string, id: number, name: string, selected: boolean }
type TViewGroup = { groupKey: string, name: string, visible: boolean, params: string[] }
type TViewCategory = { name: string, visible: boolean }

type TmpGroup = { groupName: string, params: string[] }
type TmpCat = { groupName: string, params: string[] }
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


  // let selectedCurrentParamIndices = ref<number[]>([])
  // let selectedAllParamsByCategoryGroup = ref<number[]>([])
  const module = computed(() => {
    return current.value.module
  })

  const selectedFilters = computed(() => {
    let groups: TmpGroup[] = []

    selectedFilterParams.value.forEach(x => {
      let pieces = x.split('.')
      let group = pieces[0]
      let param = pieces[1]

      let i = groups.findIndex(x => x.groupName === group)
      if (i === -1) {
        let params: string[] = [param]
        groups.push({ groupName: group, params: params })
      } else {
        groups[i].params.push(param)
      }
    })
    return groups
  })

  const selectedFiltersByCat = computed(() => {







    // let groups: TmpGroup[] = []
    // let cats: TmpCat[] = []

    // selectedFilterParams.value.forEach(x => {
    //   let pieces = x.split('.')
    //   let group = pieces[0]
    //   let param = pieces[1]

    //   let i = groups.findIndex(x => x.groupName === group)
    //   if (i === -1) {
    //     let params: string[] = [param]
    //     groups.push({ groupName: group, params: params })
    //   } else {
    //     groups[i].params.push(param)
    //   }
    // })

    // //groups are now set
    // let categories = []
    // let show = false
    // //go over categories and set groups in correct category
    // trio.value.result.forEach(r => {
    //   let groupsInCategory = trio.value.entities.categories[r].groups
    //   for (let i = 0; i < groupsInCategory.length; i++) {

    //     if (groups.some(x => x.groupName === groupsInCategory[i])) {
    //       categories.push({ categoryName: r, groups: "hh" })
    //       break
    //     }
    //   }

    // })

    // return groups


  })





  const visibleCategories = computed<TViewCategory[]>(() => {
    return trio.value.result.map(x => { return { name: trio.value.entities.categories[x].name, visible: true } })
  })

  const visibleGroups = computed<TViewGroup[]>(() => {
    if (trio.value.result.length === 0) { return [] }
    let groupKeys = <string[]>trio.value.entities.categories[trio.value.result[selectedCategoryIndex.value]].groups
    return groupKeys.map(x => {
      return {
        name: trio.value.entities.groups[x].group_name,
        groupKey: x,
        visible: true,
        params: trio.value.entities.groups[x].params
      }
    })
  })

  const viewableGroups = computed<TViewGroup[]>(() => {
    function isViewable(dependency: string[]) {
      dependency.forEach(x => {
        if (selectedFilterParams.value.includes(x)) { return true }
      })
      return false
    }

    if (trio.value.result.length === 0) { return [] }
    let groupKeys = <string[]>trio.value.entities.categories[trio.value.result[selectedCategoryIndex.value]].groups

    return groupKeys.map(x => {
      let group = trio.value.entities.groups[x]
      let visible = true
      switch (group.group_type_code) {
        case 'TM':
        case 'TG':
          let tagGroup = <TGroupTag>group;
          visible = tagGroup.dependency === null ? true : isViewable(tagGroup.dependency)
      }

      return {
        name: trio.value.entities.groups[x].group_name,
        groupKey: x,
        visible,
        params: trio.value.entities.groups[x].params
      }
    })

  })

  const visibleParams = computed<TViewParam[]>((source: string) => {
    if (trio.value.result.length === 0) { return [] }
    let paramKeys = visibleGroups.value[selectedGroupIndex.value].params
    return paramKeys.map(x => { return { ...trio.value.entities.params[x], selected: selectedFilterParams.value.includes(x) } })
  })

  function setTrio(res: object) {
    resetTrio()
    trio.value = normalizeTrio(res);
  }

  function initFilters() {
    for (const [key, value] of Object.entries(trio.value.entities.groups)) {
      //console.log(`${key}: ${value}`);
      //groupsFilter.value.push(key)
    }
  }

  function paramClicked(groupIndex: number, paramIndex: number) {
    console.log(`TRIO.paramClicked() GroupIndex ${groupIndex}: ParamIndex: ${paramIndex} clicked`)
    let visibleGroupItem = visibleGroups.value[groupIndex]
    let groupInfo = trio.value.entities.groups[visibleGroupItem.groupKey]
    let paramInfo = visibleParams.value[paramIndex]
    //console.log(`groupInfo ${JSON.stringify(groupInfo, null, 2)} ParamInfo: ${JSON.stringify(paramInfo, null, 2)}`)

    //toggle
    let selected = null
    switch (current.value.name) {
      case 'filter':
        selected = selectedFilterParams.value
        break
      case 'tags':
        selected = selectedNewItemParams.value
        break
      default:
        console.log(`param clicked but not filter or tags - returning`)
        return
    }

    //console.log(`groupInfo ${JSON.stringify(groupInfo, null, 2)} ParamInfo: ${JSON.stringify(paramInfo, null, 2)}`)
    selected = (current.value.name === 'filter') ? selectedFilterParams.value : selectedNewItemParams.value

    let i = selected.findIndex((x) => x === paramInfo.paramKey)
    if (i === -1) {
      selected.push(paramInfo.paramKey)
      selected.sort((a,b) => { return trio.value.entities.params[a].order - trio.value.entities.params[b].order})
    } else {
      selected.splice(i, 1)
      clearDependecies(paramInfo.paramKey)
    }
  }

  function clearDependecies(paramKey: string) {
    console.log(`clearDependecies param: ${paramKey}`)
    //we assume that this param was already removed from selected.
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

  return { selectedFiltersByCat, selectedFilters, viewableGroups, trio, setTrio, paramClicked, selectedFilterParams, visibleCategories, visibleGroups, visibleParams, selectedCategoryIndex, selectedGroupIndex }
})