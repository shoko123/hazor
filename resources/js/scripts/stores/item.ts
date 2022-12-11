// stores/media.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { TItemFields, TStoneFields } from '../../types/itemTypes'
import { useModuleStore } from './module'
import { useRoutesMainStore } from './routes/routesMain'

export const useItemStore = defineStore('item', () => {

  const { getRouteInfo } = useRoutesMainStore()
  let fields = ref<object | undefined>(undefined)
  let ready = true
  const itemViewIndex = ref<number>(0)
  const indexInCollection = ref<number | undefined>(undefined)

  const derived = computed(() => {
    return { module: 'XXX', url_id: getRouteInfo().value.url_id }
  })
  return { ready, fields, derived, itemViewIndex }
})
