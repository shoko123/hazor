// stores/trio.js
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import type { TGroupTag, TGroupsWithDependency, Trio } from '../../../types/trioTypes'
import normalizeTrio from './trioNormalizerKKKKKKK'
import { useFilterStore } from './filter'
import { useTaggerStore } from './tagger'
import { useRoutesMainStore } from '../routes/routesMain'

export const useTrioStore = defineStore('trio', () => {
  const { selectedFilterParams } = storeToRefs(useFilterStore())
  const { current } = storeToRefs(useRoutesMainStore())
  const trio = ref<Trio>({
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
  const categoryIndex = ref<number>(0)

  //index in visible groups
  const groupIndex = ref<number>(0)

  const selected = computed(() => {
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
    return current.value.name === 'filter'
  })

  const isNewParams = computed(() => {
    return current.value.name === 'tag'
  })

  //A category is visible if at least one of its groups is available 
  const visibleCategories = computed(() => {
    const cats: { catName: string, grpKeys: string[], cnt: number }[] = []

    availableGroupsKeys.value.forEach(x => {
      const group = trio.value.entities.groups[x]

      //count
      const selectedCount = groupSelectedParamsCnt(x)
      //console.log(`cnt: ${selectedCount}`)
      const i = cats.findIndex(x => x.catName === group.categoryKey)
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
    const agk = []
    for (const [key] of Object.entries(trio.value.entities.groups)) {
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

    const vc = visibleCategories.value.map(x => x.name)
    const perCategoryGroupsKeys = trio.value.entities.categories[vc[categoryIndex.value]].groups

    //filter only available groups
    const visibleGroupsKeys = perCategoryGroupsKeys.filter(x => availableGroupsKeys.value.includes(x))

    return visibleGroupsKeys.map(x => {
      const group = trio.value.entities.groups[x]
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
    const g = trio.value.entities.groups[groupKey]

    //if source is 'New' don't show CS, CR, MD and OB groups.
    if (isNewParams.value && ["CS", "MD", "CR", "CB", "OB"].includes(g.group_type_code)) {
      return false
    }

    //if source is filter, and not TM or TG all these groups are available.
    if (["CS", "CV", "CR", "CB", "MD", "OB"].includes(g.group_type_code)) {
      return true
    }

    if (["TM", "TG", "CL"].includes(g.group_type_code)) {
      const tagGroup = <TGroupsWithDependency>g
      return tagGroup.dependency === null ||
        tagGroup.dependency.some(x => {
          return (selected.value.includes(x))
        })
    }
    console.log(`**** Error group availability unexpected type : ${g.group_type_code}`)
    return true
  }

  function groupSelectedParamsCnt(groupKey: string) {
    const selectedCount = selected.value.reduce((accumulator, param) => {
      const toAdd = (parseParamKey(param, false) === groupKey ? 1 : 0)
      return accumulator + toAdd
    }, 0);
    return selectedCount
  }


  const visibleParams = computed(() => {
    if (trio.value.result.length === 0) { return [] }
    const paramKeys = visibleGroups.value[groupIndex.value].params
    return paramKeys.map(x => { return { ...trio.value.entities.params[x], selected: selected.value.includes(x) } })
  })

  function paramClicked(groupIndex: number, paramIndex: number) {
    const paramInfo = visibleParams.value[paramIndex]
    const group = trio.value.entities.groups[parseParamKey(paramInfo.paramKey, false)]
    const paramKey = paramInfo.paramKey
    const isSelected = selected.value.includes(paramInfo.paramKey)
    console.log(`TRIO.click(${groupIndex}, ${paramIndex}): "${paramInfo.paramKey}" isFilter: ${isFilter.value} isCurrentlySelected: ${isSelected}`)

    if (isFilter.value) {
      if (isSelected) {
        unSelectParam(paramKey)
      } else {
        selectParam(paramKey)
      }
      return
    }

    //new tags for item
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

  function selectParam(paramKey: string) {
    //insert into ordered "selected" at the correct location
    const orderNo = trio.value.entities.params[paramKey].order
    const inserIndex = insertIndex(orderNo)
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
    const groupsToBeUnselectable: TGroupsWithDependency[] = []
    for (const [key, value] of Object.entries(trio.value.entities.groups)) {
      key//make eslint happy
      
      //only Tag groups may be dependent
      if (!["TG", "TM", "CL"].includes(value.group_type_code)) {
        continue
      }

      //collect only those whose dependency includes paramKey
      const group = <TGroupsWithDependency>value
      if (group.dependency === null || !group.dependency.includes(paramKey)) {
        continue
      }

      //check if dependency holds or not
      const groupIstoBeUnselected = !group.dependency.some(x => {
        return (selected.value.includes(x))
      })

      if (groupIstoBeUnselected) {
        //console.log(`Pushing Group ${group.group_name} to groupsToBeUnselectable`);
        groupsToBeUnselectable.push(group)
      }
    }

    console.log(`Extra Groups to be unselectable: ${groupsToBeUnselectable.map(x => x.group_name)}`)

    //step 2 - collect all params to be unselected
    const paramsToBeUnselected: string[] = []
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
      const i = selected.value.findIndex((y) => y === x)
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
    const pieces = paramKey.split('.')
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

  function orderSelectedParams(params: string[]) {
    console.log(`orderItemTags()`)
    params.sort((a, b) => trio.value.entities.params[a].order - trio.value.entities.params[b].order)
  }

  function getParamKeyByGroupAndId(group: string, id: number): string {
    const groupParamKeys = trio.value.entities.groups[group].params
    const paramKey = groupParamKeys.find(x => trio.value.entities.params[x].id === id)
    //console.log(`getParamKeyByGroupAndId(group(${group}), id(${id})) => ${paramKey}`)    
    return <string>paramKey
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
    setOrderByString,
    orderSelectedParams,
    getParamKeyByGroupAndId
  }
})