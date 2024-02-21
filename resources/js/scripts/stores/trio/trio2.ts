// stores/trio.js
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import type { TApiTrio2, TTrio, TGroupLabelToKey, TGroupLocalTag, TApiParamNameAndColumn } from '../../../types/trioTypes2'
import { useFilterStore } from './filter'
import { useTrioNormalizerStore2 } from './trioNormalizer2'
import { useRoutesMainStore } from '../routes/routesMain'
import { useTaggerStore } from './tagger'

export const useTrioStore2 = defineStore('trio2', () => {
  const { selectedFilterParams2 } = storeToRefs(useFilterStore())
  const { normalizeTrio2 } = useTrioNormalizerStore2()
  const { current } = storeToRefs(useRoutesMainStore())

  const trio = ref<TTrio>({ categories: [], groupsObj: {}, paramsObj: {} })
  const groupLabelToKey = ref<TGroupLabelToKey>({})
  const orderByOptions = ref<TApiParamNameAndColumn[]>([])

  //current index of visible categories/groups
  const categoryIndex = ref<number>(0)
  const groupIndex = ref<number>(0)


  //A category is visible if at least one of its groups is available 
  const visibleCategories = computed(() => {
    const visCats: { catName: string, catIndex: number, cnt: number }[] = []
    for (let [index, cat] of trio.value.categories.entries()) {
      //for (const cat of trio.value.categories) {
      let available = false
      for (const grpKey of cat.groupKeys) {
        if (groupIsAvailable(grpKey)) {
          available = true
          break
        }
      }
      if (available) {
        visCats.push({ catName: cat.name, catIndex: index, cnt: 1 })
      }
    }
    //console.log(`visibleCats: ${JSON.stringify(visCats, null, 2)}`)

    return visCats
  })

  //returns groups that belong to the currently selected category, and that are also available.
  //add counts


  const visibleGroups = computed(() => {
    if (trio.value.categories.length === 0) { return [] }

    let grpKeys = trio.value.categories[visibleCategories.value[categoryIndex.value].catIndex].groupKeys

    //filter out unavailable groups
    const available = grpKeys.filter(x => groupIsAvailable(x))

    return available.map(x => {
      const group = trio.value.groupsObj[x]
      let required = false
      let multiple = false
      switch (group.code) {
        case "CV":
        case "CL":
          required = true
          multiple = false
          break

        case "TM":
        case "TG":
          required = false
          multiple = (<TGroupLocalTag>group).multiple
          break
        default:
          break
      }
      return {
        name: group.label,
        groupKey: x,
        visible: true,
        selectedCount: groupSelectedParamsCnt(x),
        groupType: group.code,
        required,
        multiple,
        params: group.paramKeys
      }
    })
  })

  //Is group available?.
  function groupIsAvailable(groupKey: string) {
    const g = trio.value.groupsObj[groupKey]

    //if source is 'New' don't show CS, CR, MD and OB groups.
    if (current.value.name === 'tag' && ["CS", "MD", "CR", "CB", "OB"].includes(g.code)) {
      return false
    }

    //if source is filter, and not TM or TG all these groups are available.
    if (["CS", "CV", "CR", "CB", "MD", "OB"].includes(g.code)) {
      return true
    }

    if (["TM", "TG", "CL"].includes(g.code)) {
      const tagGroup = <TGroupLocalTag>g
      return tagGroup.dependency.length === 0 ||
        tagGroup.dependency.some(x => {
          return (selected.value.includes(x))
        })
    }
    console.log(`**** Error group availability unexpected type : ${g.code}`)
    return true
  }

  function paramClicked(prmKey: string) {
    const param = trio.value.paramsObj[prmKey]
    const group = trio.value.groupsObj[param.groupKey]

    const isSelected = selected.value.includes(prmKey)
    console.log(`TRIO.click(${prmKey}) "${param.text}" selected: ${isSelected}`)

    if (current.value.name === 'filter') {
      if (isSelected) {
        unSelectParam(prmKey)
      } else {
        selectParam(prmKey)
      }
      return
    }

    //new tags for item
    switch (group.code) {
      case "TG":
      case "TM":
        if ((<TGroupLocalTag>group).multiple) {
          if (isSelected) {
            unSelectParam(prmKey)
          } else {
            selectParam(prmKey)
          }
        } else {
          if (isSelected) {
            unSelectParam(prmKey)
          } else {
            //if there is currently  a  selected one - unselect the currently selected and select the new one.
            //if there isn't, select the new one.
            const currentKey = selected.value.find(x => { return trio.value.groupsObj[trio.value.paramsObj[x].groupKey].label === group.label })
            if (currentKey !== undefined) {
              unSelectParam(currentKey)
              selectParam(prmKey)
            } else {
              console.log("No param currently selected - selecting clicked")
              selectParam(prmKey)
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
          const currentKey = selected.value.find(x => { return trio.value.groupsObj[trio.value.paramsObj[x].groupKey].label === group.label })
          if (currentKey === undefined) {
            console.log("Error in paramNewClicked - can't find a selected param in current group, wrong group_type_code")
            return
          }
          console.log(`newItemParams(CL or CV).clicked select: ${prmKey}, unSelect: ${currentKey}`)
          unSelectParam(currentKey)
          selectParam(prmKey)
        }
        break
      default:
        console.log("Error in paramNewClicked - wrong group_type_code")
    }
  }


  function selectParam(prmKey: string) {
    console.log(`selectParam2(${prmKey})`)
    selected.value.push(prmKey)
  }

  function unSelectParam(paramKey: string) {
    const i = selected.value.indexOf(paramKey)
    selected.value.splice(i, 1)
    clearDependecies(paramKey)
  }

  //When unselecting a param, we must check and possibly unselect dependencies.
  function clearDependecies(paramKey: string) {
    console.log(`*** clearDependecies param: ${paramKey} currently selected: ${selected.value} ***`)
    //We assume that this param was already removed from paramClickedSource (selectedFilterParams/selectedNewItemParams).

    //step 1 - collect all groups affected by unselecting this param
    const groupsToUnselect: {grpKey: string, label: string, paramKeys: string[]}[] = []
    
    for (const [key, value] of Object.entries(groupLabelToKey.value)) {
      key//make eslint happy
      const group = trio.value.groupsObj[value]

      //if a group has a dependency that includes this param and will be unselected if param is unselected,
      // add it to the groupsToUnselect array
      if ('dependency' in group && group.dependency.includes(paramKey) && !group.dependency.some(x => {
        return (selected.value.includes(x))
      })) {
          console.log(`group ${group.label} is dependent on "${key}" => ${value}`)
          groupsToUnselect.push({grpKey: value, label: group.label, paramKeys: group.paramKeys})
      }
    }

    console.log(`Extra Groups to be unselectable: ${JSON.stringify(groupsToUnselect, null, 2)}`)

    //step 2 - collect all params to be unselected
    const paramsToBeUnselected: string[] = []
    groupsToUnselect.forEach(x => {
      x.paramKeys.forEach(y => {
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
  function groupSelectedParamsCnt(groupKey: string) {
    const paramKeys = trio.value.groupsObj[groupKey].paramKeys
    const selectedCount = paramKeys.reduce((accumulator, param) => {
      const toAdd = (selected.value.includes(param) ? 1 : 0)
      return accumulator + toAdd
    }, 0);
    return selectedCount
  }


  const visibleParams = computed(() => {
    if (trio.value.categories.length === 0) { return [] }
    const paramKeys = trio.value.groupsObj[visibleGroups.value[groupIndex.value].groupKey].paramKeys
    return paramKeys.map(x => { return { ...trio.value.paramsObj[x], selected: selected.value.includes(x), key: x } })
  })

  const selected = computed(() => {
    const { selectedNewItemParams2 } = storeToRefs(useTaggerStore())
    switch (current.value.name) {
      case 'filter':
        return selectedFilterParams2.value
      case 'tag':
        return selectedNewItemParams2.value
      default:
        return []
    }
  })

  function trioReset2() {
    const { selectedNewItemParams } = storeToRefs(useTaggerStore())
    selectedNewItemParams.value = []
    selectedFilterParams2.value = []
    groupIndex.value = 0
    categoryIndex.value = 0
    trio.value = { categories: [], groupsObj: {}, paramsObj: {} }
    groupLabelToKey.value = {}
    orderByOptions.value = [] 
  }

  function setTrio2(apiTrio: TApiTrio2) {
   trioReset2()

    const res = normalizeTrio2(apiTrio)
    trio.value = res.trio
    groupLabelToKey.value = res.groupLabelToKey
    orderByOptions.value = res.orderByOptions
  }

  function assert(condition: unknown, msg?: string): asserts condition {
    if (condition === false) throw new Error(msg)
  }

  function groupDetails(groupKey: string) {
    assert(groupKey in trio.value.groupsObj, `groupObj[${groupKey}] doesn't exist!`)

    const grp = trio.value.groupsObj[groupKey]
    //console.log(`paramDetails(${groupKey}) =>  ${JSON.stringify(paramsObj.value[groupKey], null, 2)}. grp:  ${JSON.stringify(grp, null, 2)}`)
    return {
      label: grp.label,
      groupCode: grp.code,
      params: grp.paramKeys.reduce(
        (accumulator, currentValue) => accumulator + trio.value.paramsObj[currentValue].text + ', ',
        ''
      ),
      available: groupIsAvailable(groupKey),
      cnt: groupSelectedParamsCnt(groupKey)
    }
  }

  const groups = computed(() => {
    let grpList = []
    for (const [key, value] of Object.entries(trio.value.groupsObj)) {
      grpList.push(groupDetails(key))
      //console.log(`grpList(${key}) =>  ${JSON.stringify(g, null, 2)}`)
    }
    return grpList
  })

  return {
    trio,
    groupLabelToKey,
    orderByOptions,
    groups,
    trioReset2,
    setTrio2,
    categoryIndex,
    groupIndex,
    visibleCategories,
    visibleGroups,
    visibleParams,
    paramClicked
  }
})