// stores/media.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { TItemMandatoryFields } from '../../types/itemTypes'
import { useModuleStore } from './module'
import { useRoutesMainStore } from './routes/routesMain'

export const useItemStore = defineStore('item', () => {

  const { getRouteInfo } = useRoutesMainStore()
  let fields = ref<TItemMandatoryFields | undefined>(undefined)
  let ready = true
  const itemViewIndex = ref<number>(0)
  const indexInCollection = ref<number>(-1)

  const id = computed(() => {
    return typeof fields.value === 'undefined' ? -1 : (<TItemMandatoryFields>fields.value).id
  })

  const derived = computed(() => {
    return { module: 'XXX', url_id: getRouteInfo().value.url_id }
  })
  return { ready, fields, id, derived, itemViewIndex }
})
