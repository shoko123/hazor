// stores/trio.js
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { TGroupTag, TGroup, Trio, TrioSourceName, TmpGroup, TGroupValue, TColumnInfo } from '../../types/trioTypes'
import { useXhrStore } from './xhr'
import { useItemStore } from './item'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'
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
    let c = visibleCategories(sourceName)
    return c.map(x => x.name)
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
            if (currentKey !== undefined) {
              flipParam(sourceName, currentKey, selected, false)
              flipParam(sourceName, paramKey, selected, true)
            } else {
              console.log("No param currently selected - selecting clicked")
              flipParam(sourceName, paramKey, selected, true)
            }
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

  async function submit() {
    let { send } = useXhrStore()
    let { fields } = useItemStore()
    let { current } = storeToRefs(useRoutesMainStore())
    console.log(`trio.submit()`)
    let globalTagIds = <number[]>([])
    let modelTagIds = <number[]>([])
    let columns = <TColumnInfo[]>([])

    selectedNewItemParams.value.forEach(paramKey => {
      let group = trio.value.entities.groups[parseParamKey(paramKey, false)]
      switch (group.group_type_code) {
        case "TG":
          globalTagIds.push(trio.value.entities.params[paramKey].id)
          break
        case "TM":
          modelTagIds.push(trio.value.entities.params[paramKey].id)
          break
        case "LV":
        case "CV":
          let param = trio.value.entities.params[paramKey]
          let column_name = (<TGroupValue>group).column_name
          columns.push({ column_name, val: param.id, paramKey: param.paramKey })
          break
      }
    })
    let data = {
      model: current.value.module,
      id: current.value.url_id,
      ids: globalTagIds,
      model_tag_ids: modelTagIds,
      columns
    }

    console.log(`tags.sync() data: ${JSON.stringify(data, null, 2)}`)

    let res = await send('tags/sync', 'post', data)
      .catch(err => {
        console.log(`tags.sync() failed. err: ${JSON.stringify(err, null, 2)}`)
        throw err
      })
    categoryIndex.value = 0
    groupIndex.value = 0

    //console.log(`tags.sync() res.data: ${JSON.stringify(res.data.all_tags, null, 2)}`)
    selectedItemParams.value = [...res.data.all_tags]

    //TODO fix this ugly casting later
    let genFields = fields as unknown as {
      [key: string]: number | string
    }

    let cols: TColumnInfo[] = [...res.data.columns]
    cols.forEach(x => {
      genFields[x.column_name] = x.val
    })
    clearSelected('New')
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
    groupsWithASelectedParam,
    copyCurrentToNew,
    saveItemTags,
    submit
  }
})