// stores/media.js
import type { TFields } from '@/js/types/moduleFieldsTypes'
import type { TMedia } from '@/js/types/mediaTypes'
import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { TApiItemShow, TApiItemUpdate } from '@/js/types/itemTypes'
import { TApiArrayMedia, TApiArrayMain } from '@/js/types/collectionTypes'
import { useCollectionsStore } from './collections/collections'
import { useCollectionMainStore } from './collections/collectionMain'
import { useRoutesMainStore } from './routes/routesMain'
import { useXhrStore } from './xhr'
import { useModuleStore } from './module'
import { useMediaStore } from './media'
import { useTrioStore } from './trio'
import { useNotificationsStore } from './notifications'

export const useItemStore = defineStore('item', () => {
  const { pushToArray } = useCollectionMainStore()
  const { current, to } = storeToRefs(useRoutesMainStore())
  const { collection, itemByIndex, itemIndexById, next } = useCollectionsStore()
  const moduleStore = useModuleStore()
  const { setItemMedia } = useMediaStore()
  const { saveItemTags } = useTrioStore()
  const { send } = useXhrStore()
  const { showSnackbar, showSpinner } = useNotificationsStore()
  let fields = ref<TFields | undefined>(undefined)
  let slug = ref<string | undefined>(undefined)
  let tag = ref<string | undefined>(undefined)
  let media1 = ref<TMedia>({ hasMedia: false, urls: { full: '', tn: '' } })
  let ready = ref<boolean>(false)
  const itemViewIndex = ref<number>(0)
  const itemIndex = ref<number>(-1)

  const id = computed(() => {
    return typeof fields.value === 'undefined' ? -1 : (<TFields>fields.value).id
  })


  const getItemViewIndex = computed(() => {
    return itemViewIndex.value
  })

  function setItemViewIndex(index: number) {
    itemViewIndex.value = index
  }
  const derived = computed(() => {
    return { module: current.value.module, slug: current.value.slug }
  })

  function saveItem(apiItem: TApiItemShow) {
    fields.value = apiItem.fields
    slug.value = apiItem.slug
    tag.value = moduleStore.tagFromSlug(current.value.module, apiItem.slug)
    setItemMedia(apiItem.mediaArray, apiItem.mediaPage, apiItem.media1)
    saveItemTags(apiItem.model_tags, apiItem.global_tags, apiItem.discrete_columns)
  }

  function itemClear() {
    itemIndex.value = -1
    fields.value = undefined
    slug.value = undefined
    tag.value = undefined
    media1.value = { hasMedia: false, urls: { full: '', tn: '' } }
  }

  function nextSlug(isRight: boolean) {
    let newIndex
    let length = collection('main').value.meta.length
    if (isRight) {
      newIndex = (itemIndex.value === length - 1) ? 0 : itemIndex.value + 1
    } else {
      newIndex = (itemIndex.value === 0) ? length - 1 : itemIndex.value - 1
    }

    //TODO change id to slug
    const mainArrayItem = <TApiArrayMain>itemByIndex('main', newIndex)
    console.log(`nextSlug: ${mainArrayItem.slug}`)
    return mainArrayItem.slug
  }

  //return the newly created/update item's slug (need it only for create())
  async function upload(isCreate: boolean, newFields: TFields): Promise<TApiItemShow> {
    console.log(`item.upload isCreate: ${isCreate}, module: ${current.value.module}, fields: ${JSON.stringify(newFields, null, 2)}`)
    let res = await send('model/store', isCreate ? 'post' : 'put', { model: current.value.module, item: newFields, id: newFields.id })
      .catch(err => {
        showSnackbar(`model.store failed! Please try later!`)
        console.log(`model.store  failed. err: ${JSON.stringify(err, null, 2)}`)
        throw err
      })

    if (isCreate) {
      saveItem(res.data)
      let newIndex = pushToArray({ "id": res.data.fields.id, "slug": res.data.slug })
      itemIndex.value = newIndex
      //console.log(`item pushed to main array. index: ${itemIndex.value}`)
    } else {
      fields.value = res.data.fields
      slug.value = res.data.slug
    }
    console.log(`model.store() returned (success) ${JSON.stringify(res.data, null, 2)}`)
    showSnackbar(`${current.value.module} ${isCreate ? "created" : "updated"} successfully! redirecting to item`)
    return res.data
  }

  async function destroy(): Promise<string | null> {
    const { removeItemFromArrayById } = useCollectionMainStore()
    const prev = next('main', itemIndexById((<TFields>fields.value).id), false)

    showSpinner('Accessing DB to delete record')
    await send("model/destroy", 'post', { model: current.value.module, id: (<TFields>fields.value).id })
      .catch((err) => {
        showSnackbar("Failed to delete item!", 'red')
        showSpinner(false)
        console.log(`Destroy failed! err:\n ${JSON.stringify(err, null, 2)}`)
        throw (`${current.value.module} item.destroy() failed`)
      })

    showSnackbar("Item deleted successfully")
    showSpinner(false)
    console.log(`${current.value.module}item.destroy() success!`)
    const newLength = removeItemFromArrayById((<TFields>fields.value).id)

    //go to 'previous' slug or to module.home (if array.length is 1)
    if (newLength === 0) {
      return null
    } else {
      return (<TApiArrayMain>prev.item).slug
    }
  }

  return {
    slug,
    tag,
    ready,
    fields,
    id,
    derived,
    media1,
    itemIndex,
    nextSlug,
    itemClear,
    itemViewIndex,
    setItemViewIndex,
    saveItem,
    upload,
    destroy
  }
})
