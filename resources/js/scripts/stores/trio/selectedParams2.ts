import { defineStore, storeToRefs } from 'pinia'
import { computed } from 'vue'
import { TrioSourceName } from '../../../types/trioTypes2'

import { useTrioStore2 } from './trio2'
import { useItemStore } from '../item'
import { useFilterStore } from './filter'
import { useTaggerStore } from './tagger'

type TGroup = { label: string, params: string[] }
type TCat = { label: string, groups: TGroup[] }

export const useTrioSelectedStore2 = defineStore('trioSelected2', () => {
  const { trio, groupLabelToKey } = storeToRefs(useTrioStore2())
  const { selectedItemParams2 } = storeToRefs(useItemStore())
  const { selectedFilterParams2 } = storeToRefs(useFilterStore())
  const { selectedNewItemParams2 } = storeToRefs(useTaggerStore())

  function selectedTrio(sourceName: TrioSourceName) {
    if (trio.value.categories.length === 0) { return [] }

    let params: string[] = []
    let groups = <TGroup[]>[]
    let cats = <TCat[]>[]

    //choose source
    switch (sourceName) {
      case 'Filter':
        params = selectedFilterParams2.value
        break
      case 'Item':
        params = selectedItemParams2.value.filter(x => trio.value.paramsObj[x].text !== 'Unassigned')
        break
      case 'New':
        params = selectedNewItemParams2.value
        break
    }

    //order params by their keys
    params.sort((a, b) => { return a > b ? 1 : -1 })

    //push params into "groups" objects array, each entry consisting of label and its params array
    params.forEach(p => {
      const group = trio.value.groupsObj[trio.value.paramsObj[p].groupKey]    
      
      const i = groups.findIndex(g => {
        return g.label === group.label
      })

      if (i === -1) {
        //if new group, push the param's group into the groups array with itself as the first param
        groups.push({ label: group.label, params: [trio.value.paramsObj[p].text] })
      } else {
        //if the group is already selected, add param's text to the group's params array
        groups[i].params.push(trio.value.paramsObj[p].text)
      }
    })

    //Now all the groups are organized in a sorted array, find their categories.
    groups.forEach(g => {
      const group = trio.value.groupsObj[groupLabelToKey.value[g.label]]
      const cat = trio.value.categories[group.categoryIndex]

      const i = cats.findIndex(c => {
        return c.label === cat.name
      })

      if (i === -1) {
        //if the group belongs to a new category, push the new category into the categories array with itself as the first group
        cats.push({ label: cat.name, groups: [g] })
      } else {
        //if the category is already selected, add the group label to the category's groups array
        cats[i].groups.push(g)
      }
    })
    return cats
    /*
    //organize all params into groups array, each item with the group's name and its params array
    selectedParams.forEach(x => {
      const pieces = x.split('.')
      const group = pieces[0]
      const i = groups.findIndex(g => {
        return g.key === group
      })

      if (i === -1) {
        groups.push({ key: group, params: [trio.value.entities.params[x].name] })
      } else {
        groups[i].params.push(trio.value.entities.params[x].name)
      }
    })

    //organize all groups into categgories array, each item with the category's name and its groups array
    groups.forEach(x => {
      const catKey = trio.value.entities.groups[x.key].categoryKey
      const i = cats.findIndex(c => {
        return c.name === catKey
      })

      if (i === -1) {
        cats.push({ name: catKey, groups: [x] })
      } else {
        cats[i].groups.push(x)
      }
    })

    //sort categories according to their order from trio structure
    cats.sort((a, b) => { return trio.value.result.findIndex(c => c === a.name) - trio.value.result.findIndex(c => c === b.name) })
    return cats
    */
  }

  const selectedFilterTrio = computed(() => {
    return selectedTrio('Filter')
  })

  const selectedNewItemTrio = computed(() => {
    return selectedTrio('New')
  })

  const selectedItemTrio = computed(() => {
    return selectedTrio('Item')
  })

  return {
    selectedFilterTrio,
    selectedItemTrio,
    selectedNewItemTrio,
  }
})