// stores/trio.js
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import type { TGroupTag, TGroup, Trio, TrioSourceName, TmpGroup, TGroupValue, TColumnValueUpdateInfo } from '../../../types/trioTypes'
import normalizeTrio from './trioNormalizer'
import { useFilterStore } from './filter'
import { useTaggerStore } from './tagger'
import { useRoutesMainStore } from '../routes/routesMain'

export const useTrioStore = defineStore('trio', () => {
  const { selectedFilterParams } = storeToRefs(useFilterStore())

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

  //index in visible categories
  let categoryIndex = ref<number>(0)

  //index in visible groups
  let groupIndex = ref<number>(0)

  const selected = computed(() => {
    const { current } = storeToRefs(useRoutesMainStore())
    const { selectedNewItemParams } = storeToRefs(useTaggerStore())
    switch (current.value.name) {
      case 'filter':
        return selectedFilterParams.value
      case 'tag':
        return selectedNewItemParams.value
      default:
        return []
    }
  })

  const isFilter = computed(() => {
    const { current } = storeToRefs(useRoutesMainStore())
    return current.value.name === 'filter'
  })

  const isNewParams = computed(() => {
    const { current } = storeToRefs(useRoutesMainStore())
    return current.value.name === 'tag'
  })

  //A category is visible if at least one of its groups is available 
  const visibleCategories = computed(() => {
    let cats: { catName: string, grpKeys: string[], cnt: number }[] = []

    availableGroupsKeys.value.forEach(x => {
      let group = trio.value.entities.groups[x]

      //count
      let selectedCount = groupSelectedParamsCnt(x)
      //console.log(`cnt: ${selectedCount}`)
      let i = cats.findIndex(x => x.catName === group.categoryKey)
      if (i === -1) {
        cats.push({ catName: group.categoryKey, grpKeys: [x], cnt: selectedCount })
      } else {
        cats[i].cnt += selectedCount
      }
    })
    const res = cats.map(x => { return { name: x.catName, visible: true, selectedCount: x.cnt } })
    //console.log(`visibleCategories: ${JSON.stringify(res, null, 2)}`)
    return res
  })

  const availableGroupsKeys = computed(() => {
    let agk = []
    for (const [key, value] of Object.entries(trio.value.entities.groups)) {
      if (groupIsAvailable(key)) {
        agk.push(key)
      }
    }
    return agk
  })

  //returns groups that belong to the currently selected category, and that are also available.
  //add counts


  const visibleGroups = computed(() => {
    if (trio.value.result.length === 0) { return [] }

    let vc = visibleCategories.value.map(x => x.name)
    let perCategoryGroupsKeys = trio.value.entities.categories[vc[categoryIndex.value]].groups

    //filter only available groups
    let visibleGroupsKeys = perCategoryGroupsKeys.filter(x => availableGroupsKeys.value.includes(x))

    return visibleGroupsKeys.map(x => {
      let group = trio.value.entities.groups[x]
      let required = false
      let multiple = false
      switch (group.group_type_code) {
        case "CV":
        case "CL":
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
        selectedCount: groupSelectedParamsCnt(x),
        isTextSearch: (group.group_type_code === 'CS'),
        groupType: group.group_type_code,
        required,
        multiple,
        params: group.params
      }
    })
  })

  //Is group available?.
  function groupIsAvailable(groupKey: string) {
    let g = trio.value.entities.groups[groupKey]

    //if source is 'New' don't show CS, CR, BF and OB groups.
    if (isNewParams.value && ["CS", "BF", "CR", "OB"].includes(g.group_type_code)) {
      return false
    }

    //if source is filter, and not TM or TG all these groups are available.
    if (["CS", "CL", "CV", "CR", "BF", "OB"].includes(g.group_type_code)) {
      return true
    }

    //if TM ot TG check dependency. TODO  on NewTags check if available for scope (basket or artifact)
    let tagGroup = <TGroupTag>g
    return tagGroup.dependency === null ||
      tagGroup.dependency.some(x => {
        return (selected.value.includes(x))
      })
  }

  function groupSelectedParamsCnt(groupKey: string) {
    let selectedCount = selected.value.reduce((accumulator, param) => {
      let toAdd = (parseParamKey(param, false) === groupKey ? 1 : 0)
      return accumulator + toAdd
    }, 0);
    return selectedCount
  }


  const visibleParams = computed(() => {
    if (trio.value.result.length === 0) { return [] }
    let paramKeys = visibleGroups.value[groupIndex.value].params
    return paramKeys.map(x => { return { ...trio.value.entities.params[x], selected: selected.value.includes(x) } })
  })

  function paramClicked(groupIndex: number, paramIndex: number) {
    let paramInfo = visibleParams.value[paramIndex]
    let group = trio.value.entities.groups[parseParamKey(paramInfo.paramKey, false)]
    let paramKey = paramInfo.paramKey
    const isSelected = selected.value.includes(paramInfo.paramKey)
    console.log(`TRIO.click(${groupIndex}, ${paramIndex}): "${paramInfo.paramKey}" isFilter: ${isFilter.value} isCurrentlySelected: ${isSelected}`)

    if (isFilter.value) {
      if (isSelected) {
        unSelectParam(paramKey)
      } else {
        selectParam(paramKey)
      }
    } else {
      switch (group.group_type_code) {
        case "TG":
        case "TM":
          if ((<TGroupTag>group).multiple) {
            if (isSelected) {
              unSelectParam(paramKey)
            } else {
              selectParam(paramKey)
            }
          } else {
            if (isSelected) {
              unSelectParam(paramKey)
            } else {
              //if there is currently  a  selected one - unselect the currently selected and select the new one.
              //if there isn't, select the new one.
              const currentKey = selected.value.find(x => { return parseParamKey(x, false) === group.group_name })
              if (currentKey !== undefined) {
                unSelectParam(currentKey)
                selectParam(paramKey)
              } else {
                console.log("No param currently selected - selecting clicked")
                selectParam(paramKey)
              }
            }
          }
          break

        case "CL":
        case "CV":
          if (isSelected) {
            //do nothing
          } else {
            //unselect the currently selected and select the new one
            const currentKey = selected.value.find(x => { return parseParamKey(x, false) === group.group_name })
            if (currentKey === undefined) {
              console.log("Error in paramNewClicked - can't find a selected param in current group, wrong group_type_code")
              return
            }
            console.log(`newItemParams(CL or CV).clicked select: ${paramKey}, unSelect: ${currentKey}`)
            unSelectParam(currentKey)
            selectParam(paramKey)
          }
          break
        default:
          console.log("Error in paramNewClicked - wrong group_type_code")
      }
    }
  }

  function selectParam(paramKey: string) {
    //insert into ordered "selected" at the correct location
    let orderNo = trio.value.entities.params[paramKey].order
    let inserIndex = insertIndex(orderNo)
    //console.log(`insertIndex: ${inserIndex}`)
    selected.value.splice(inserIndex, 0, paramKey)
  }

  function insertIndex(orderNo: number) {
    let i = 0
    while (i < selected.value.length) {
      if (trio.value.entities.params[selected.value[i]].order > orderNo) {
        return i
      }
      i++
    }
    return i
  }

  function unSelectParam(paramKey: string) {
    const i = selected.value.indexOf(paramKey)
    selected.value.splice(i, 1)
    clearDependecies(paramKey)
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
        return (selected.value.includes(x))
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
        if (selected.value.includes(y)) {
          paramsToBeUnselected.push(y)
        }
      });
    })

    console.log(`Extra Params to be unselected: ${paramsToBeUnselected}`)

    //step 3 - for each paramsToBeUnselected - remove from selected, call clearDependecies() recuresively
    paramsToBeUnselected.forEach(x => {
      let i = selected.value.findIndex((y) => y === x)
      if (i === -1) {
        console.log(`ERRRRR - trying to remove param ${x} which is NOT selected`)
      } else {
        selected.value.splice(i, 1)
        clearDependecies(x)
      }
    })
  }

  function setTrio(res: object) {
    trioReset()
    trio.value = normalizeTrio(res);
  }

  function trioReset() {
    const { selectedNewItemParams } = storeToRefs(useTaggerStore())
    selectedNewItemParams.value = []
    selectedFilterParams.value = []
    groupIndex.value = 0
    categoryIndex.value = 0
    trio.value = {
      entities: {
        categories: {},
        groups: {},
        params: {}
      }, result: []
    }
  }

  function parseParamKey(paramKey: string, getParam = true): string {
    //console.log(`parseParamKey() key: ${paramKey} value: ${trio.value.entities.params[paramKey]}`)
    let pieces = paramKey.split('.')
    return getParam ? trio.value.entities.params[paramKey].name : pieces[0]
  }

  function resetCategoryAndGroupIndices() {
    groupIndex.value = 0
    categoryIndex.value = 0
  }

  function setFilterSearchTerm(paramKey: string, searchTerm: string) {
    console.log(`setFilterSearchTerm(${paramKey}, ${searchTerm})`)
    trio.value.entities.params[paramKey].name = searchTerm
  }

  function setOrderByString(paramKey: string, name: string) {
    console.log(`setOrderByTerm(${paramKey}, ${name})`)
    trio.value.entities.params[paramKey].name = name
  }

  return {
    resetCategoryAndGroupIndices,
    paramClicked,
    setTrio,
    trioReset,
    visibleCategories,
    visibleGroups,
    visibleParams,
    trio,
    categoryIndex,
    groupIndex,
    setFilterSearchTerm,
    setOrderByString
  }
})