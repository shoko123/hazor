// stores/media.js
import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { TItemMandatoryFields } from '@/js/types/moduleFieldsTypes'
import { TMedia } from '@/js/types/mediaTypes'
import { TApiArrayMedia, TApiArrayMain } from '@/js/types/collectionTypes'
import { useCollectionsStore } from './collections/collections'
import { useCollectionMainStore } from './collections/collectionMain'
import { useRoutesMainStore } from './routes/routesMain'
import { useXhrStore } from './xhr'
import { useNotificationsStore } from './notifications'
export const useItemStore = defineStore('item', () => {

  const { current } = storeToRefs(useRoutesMainStore())
  const { collection, itemByIndex, itemIndexById, next } = useCollectionsStore()

  let fields = ref<TItemMandatoryFields>({ id: -1 })
  let url_id = ref<string | undefined>(undefined)
  let tag = ref<string | undefined>(undefined)
  let media1 = ref<TMedia>({ hasMedia: false, urls: { full: '', tn: '' } })
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
    return { module: 'XXX', url_id: current.value.url_id }
  })


  function itemClear(index: number) {
    itemIndex.value = -1
    fields.value = { id: -1 }
  }

  function nextUrlId(isRight: boolean) {
    let newIndex
    let length = collection('main').value.meta.length
    if (isRight) {
      newIndex = (itemIndex.value === length - 1) ? 0 : itemIndex.value + 1
    } else {
      newIndex = (itemIndex.value === 0) ? length - 1 : itemIndex.value - 1
    }

    //TODO change id to url_id
    const mainArrayItem = <TApiArrayMain>itemByIndex('main', newIndex)
    console.log(`nextUrlId: ${mainArrayItem.url_id}`)
    return mainArrayItem.url_id
  }

  async function destroy(): Promise<string | null> {
    const xhr = useXhrStore()
    let { showSnackbar, showSpinner } = useNotificationsStore()
    const { removeItemFromArrayById } = useCollectionMainStore()
    const prev = next('main', itemIndexById(fields.value.id), false)

    showSpinner('Accessing DB to delete record')
    await xhr.send("model/destroy", 'post', { model: current.value.module, id: fields.value.id })
      .catch((err) => {
        showSnackbar("Failed to delete item!", 'red')
        showSpinner(false)
        console.log(`Destroy failed! err:\n ${JSON.stringify(err, null, 2)}`)
        throw (`${current.value.module} item.destroy() failed`)
      })

    showSnackbar("Item deleted successfully")
    showSpinner(false)
    console.log(`${current.value.module}item.destroy() success!`)
    const newLength = removeItemFromArrayById(fields.value.id)

    //go to 'previous' url_id or to module.home (if array.length is 1)
    if (newLength === 0) {
      return null
    } else {
      return (<TApiArrayMain>prev.item).url_id
    }
  }

  return {
    ready,
    fields,
    id,
    url_id,
    tag,
    derived,
    media1,
    itemIndex,
    nextUrlId,
    itemClear,
    itemViewIndex,
    setItemViewIndex,
    destroy
  }
})
