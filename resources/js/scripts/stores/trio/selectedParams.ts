import { defineStore, storeToRefs } from 'pinia'
import { computed } from 'vue'
import { TrioSourceName } from '../../../types/trioTypes'

import { useTrioStore } from './trio'
import { useItemStore } from '../item'
import { useFilterStore } from './filter'
import { useTaggerStore } from './tagger'
export const useTrioSelectedStore = defineStore('trioSelected', () => {
  const { trio } = storeToRefs(useTrioStore())
  const { selectedItemParams } = storeToRefs(useItemStore())
  const { selectedFilterParams } = storeToRefs(useFilterStore())
  const { selectedNewItemParams } = storeToRefs(useTaggerStore())

  const selectedFilterTrio = computed(() => {
    return selectedTrio('Filter')
  })

  const selectedNewItemTrio = computed(() => {
    return selectedTrio('New')
  })

  const selectedItemTrio = computed(() => {
    return selectedTrio('Item')
  })

  type TGroup = { key: string, params: string[] }

  function selectedTrio(sourceName: TrioSourceName) {
    if (trio.value.result.length === 0) { return [] }

    let groups = <TGroup[]>[]
    let cats = <{ name: string, groups: TGroup[] }[]>[]

    //choose source
    let selectedParams = []
    switch (sourceName) {
      case 'Filter':
        selectedParams = selectedFilterParams.value
        break
      case 'Item':
        selectedParams = selectedItemParams.value
        break
      case 'New':
        selectedParams = selectedNewItemParams.value
        break
    }

    //organize all params into groups array, each item with the group's name and its params array
    selectedParams.forEach(x => {
      let pieces = x.split('.')
      let group = pieces[0]
      let i = groups.findIndex(g => {
        return g.key === group
      })

      if (i === -1) {
        groups.push({ key: group, params: [trio.value.entities.params[x].name] })
      } else {
        groups[i].params.push(trio.value.entities.params[x].name)
      }
    })

    //organize all groups into categgories array, each item with the category's's name and its groups array
    groups.forEach(x => {
      let catKey = trio.value.entities.groups[x.key].categoryKey
      let i = cats.findIndex(c => {
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
  }

  return {
    selectedFilterTrio,
    selectedItemTrio,
    selectedNewItemTrio,
  }
})