// stores/media.js
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useRoutesStore } from './routes/routesMain'
import { Trio, TSelectedParam } from '../../types/trioTypes'

import normalizeTrio from './trioNormalizer'


export const useTrioStore = defineStore('trio', () => {

  const { current } = storeToRefs(useRoutesStore())

  let trio = ref<Trio>({
    entities: {
      categories: {},
      groups: {},
      params: {}
    }, result: []
  })

  let groupsFilter = ref<string[]>([])
  let groupsItem = ref<string[]>([])
  let groupsNewItem = ref<string[]>([])

  let selectedFilterParams = ref<string[]>([])
  let selectedItemParams = ref<string[]>([])
  let selectedNewItemParams = ref<string[]>([])


  let selectedGroupIndex = ref<number>(0)
  let selectedCategoryIndex = ref<number>(0)


  let selectedCurrentParamIndices = ref<number[]>([])
  let selectedAllParamsByCategoryGroup = ref<number[]>([])
  const module = computed(() => {
    return current.value.module
  })

  const visibleCategories = computed(() => {
    return trio.value.result.map(x => { return { name: trio.value.entities.categories[x].name, visible: true } })
  })


  const visibleGroups = computed(() => {
    if (trio.value.result.length === 0) { return [] }
    let groupKeys = <string[]>trio.value.entities.categories[trio.value.result[selectedCategoryIndex.value]].groups
    return groupKeys.map(x => { return { name: trio.value.entities.groups[x].group_name, groupKey: x, params: trio.value.entities.groups[x].params } })

  })

  const viewableGroups = computed(() => {
    if (trio.value.result.length === 0) { return [] }
    let groupKeys = <string[]>trio.value.entities.categories[trio.value.result[selectedCategoryIndex.value]].groups
    return groupKeys.map(x => { return { name: trio.value.entities.groups[x].group_name, groupKey: x, params: trio.value.entities.groups[x].params } })

  })

  const visibleParams = computed(() => {
    if (trio.value.result.length === 0) { return [] }
    let paramKeys = visibleGroups.value[selectedGroupIndex.value].params
    return paramKeys.map(x => { return { ...trio.value.entities.params[x], selected: selectedFilterParams.value.includes(x) } })
  })

  function setTrio(res: object) {
    //console.log(`aux/normalizeGroups() payload: ${JSON.stringify(res, null, 2)}`);

    resetTrio()
    //trio.value = normalize(res, categoriesSchema);
    trio.value = normalizeTrio(res);
    initFilters()

  }

  function initFilters() {
    for (const [key, value] of Object.entries(trio.value.entities.groups)) {
      //console.log(`${key}: ${value}`);
      groupsFilter.value.push(key)
    }
  }

  function paramClicked(groupIndex: number, paramIndex: number) {
    console.log(`TRIO.paramClicked() GroupIndex ${groupIndex}: ParamIndex: ${paramIndex} clicked`)
    let visibleGroupItem = visibleGroups.value[groupIndex]
    let groupInfo = trio.value.entities.groups[visibleGroupItem.groupKey]

    let visibleParamInfo = visibleParams.value[paramIndex]
    //console.log(`groupInfo ${JSON.stringify(groupInfo, null, 2)} ParamInfo: ${JSON.stringify(visibleParamInfo, null, 2)}`)
    let paramKey = groupInfo.group_type_code + '.' + visibleParamInfo.id
    //console.log(`paramKey: ${paramKey} selected: ${visibleParamInfo.selected}`)

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

    //console.log(`groupInfo ${JSON.stringify(groupInfo, null, 2)} ParamInfo: ${JSON.stringify(visibleParamInfo, null, 2)}`)
    selected = (current.value.name === 'filter') ? selectedFilterParams.value : selectedNewItemParams.value
    
    let i = selected.findIndex((x) => x === paramKey)
    if (i === -1) {
      selected.push(paramKey)
    } else {

      selected.splice(i, 1)
    }
    // if (i === -1) {
    //   selectedFilterParams.value.push(paramKey)
    // } else {
    //   //console.log(`paramKey: ${paramKey} to be toggled off. Found in index: ${i}`)
    //   selectedFilterParams.value.splice(i, 1)
    // }
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

  return { trio, setTrio, paramClicked, groupsFilter, selectedFilterParams, visibleCategories, visibleGroups, visibleParams, selectedCategoryIndex, selectedGroupIndex }
})