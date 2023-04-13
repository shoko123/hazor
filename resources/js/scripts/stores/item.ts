// stores/media.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { TItem, TItemMandatoryFields } from '../../types/itemTypes'
import { TMedia } from '@/js/types/mediaTypes'
import { TApiMediaOrNull } from '@/js/types/apiTypes'
import { useCollectionsStore } from './collections'
import { useRoutesMainStore } from './routes/routesMain'

export const useItemStore = defineStore('item', () => {

  const { getRouteInfo } = useRoutesMainStore()
  const { collectionMeta, itemIdsByIndex } = useCollectionsStore()
 
  let fields = ref<TItemMandatoryFields>({id: -1})
  let url_id = ref<string | undefined>(undefined)
  let tag = ref<string | undefined>(undefined)
  let media1 = ref<TMedia>({hasMedia: false, urls: {full: '', tn: ''}})
  let ready = ref<boolean>(false)
  const itemViewIndex = ref<number>(0)
  const itemIndex = ref<number>(-1)

  const id = computed(() => {
    return typeof fields.value === 'undefined' ? -1 : (<TItemMandatoryFields>fields.value).id
  })

  
  const getItemViewIndex = computed(() => {
    return itemViewIndex.value
  })

  function setItemViewIndex(index: number) {
    itemViewIndex.value = index
  }
  const derived = computed(() => {
    return { module: 'XXX', url_id: getRouteInfo().value.url_id }
  })

  const getItemIndex = computed(() => {
    return itemIndex.value
  })

  function setItemIndex(index: number) {
    itemIndex.value = index
  }
  function itemClear(index: number) {
    itemIndex.value = -1
    fields.value = {id: -1}
  }

  function nextUrlId(isRight: boolean) {
    let newIndex
    let meta = collectionMeta('main')
    if (isRight) {
      newIndex = (itemIndex.value === meta.length - 1) ? 0 : itemIndex.value + 1
    } else {
      newIndex = (itemIndex.value === 0) ? meta.length - 1 : itemIndex.value - 1
    }

    //TODO change id to url_id
    const ids = itemIdsByIndex('main', newIndex)
    console.log(`nextUrlId: ${ids.url_id}`)
    return ids.url_id
  }
  return {
    ready,
    fields,
    id,
    url_id,
    tag,
    derived,
    media1,
    getItemIndex,
    setItemIndex,
    nextUrlId,
    itemClear,
    itemViewIndex,
    setItemViewIndex
  }
})
