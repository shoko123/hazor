// stores/media.js
import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import type { TGenericFields } from '@/js/types/moduleTypes'
import type { TApiItemShow } from '@/js/types/itemTypes'
import type { TApiArrayMain } from '@/js/types/collectionTypes'
import type { IObject } from '@/js/types/generalTypes'
import { useCollectionsStore } from './collections/collections'
import { useCollectionMainStore } from './collections/collectionMain'
import { useRoutesMainStore } from './routes/routesMain'
import { useXhrStore } from './xhr'
import { useModuleStore } from './module'
import { useMediaStore } from './media'
import { useTrioStore } from './trio/trio'

export const useItemStore = defineStore('item', () => {
  const { pushToArray } = useCollectionMainStore()
  const { current } = storeToRefs(useRoutesMainStore())
  const { collection, itemByIndex, itemIndexById, next } = useCollectionsStore()
  const moduleStore = useModuleStore()
  const { setItemMedia } = useMediaStore()
  const { send2 } = useXhrStore()
  const { orderSelectedParams, getParamKeyByGroupAndId } = useTrioStore()

  const fields = ref<TGenericFields | undefined>(undefined)
  const slug = ref<string | undefined>(undefined)
  const tag = ref<string | undefined>(undefined)
  const short = ref<string | undefined>(undefined)
  const selectedItemParams = ref<string[]>([])
  const ready = ref<boolean>(false)

  const itemViews = ref<string[]>([])
  const itemViewIndex = ref<number>(0)

  const itemIndex = ref<number>(-1)

  const id = computed(() => {
    return typeof fields.value === 'undefined' ? -1 : (<TGenericFields>fields.value).id
  })

  const itemView = computed(() => {
    return itemViews.value[itemViewIndex.value]
  })

  function setItemViewIndex(index: number) {
    itemViewIndex.value = index
  }

  const derived = computed(() => {
    return {
      module: current.value.module,
      slug: current.value.slug,
      tag: tag.value,
      moduleAndTag: `${current.value === undefined ? "" : current.value.module} ${tag.value === undefined ? "" : tag.value}`,
      short: short.value
    }
  })

  function saveitemFieldsPlus<F>(apiItem: TApiItemShow<F>) {

    fields.value = <TGenericFields>apiItem.fields
    const fieldsObj = <IObject>apiItem.fields
    slug.value = apiItem.slug
    short.value = apiItem.short
    tag.value = moduleStore.tagFromSlug(current.value.module, apiItem.slug)

    const selectedLookups = moduleStore.lookups.map(x => {
      return getParamKeyByGroupAndId(x.group_name, fieldsObj[x.column_name])
    })

    //console.log(`saveitemFieldsPlus() selectedLookups:\n${selectedLookups}`)
    selectedItemParams.value = [...apiItem.model_tags, ...apiItem.global_tags, ...selectedLookups]
    orderSelectedParams(selectedItemParams.value)
  }

  //return the newly created/update item's slug (need it only for create())
  async function upload(isCreate: boolean, newFields: TGenericFields): Promise<{ success: true, slug: string } | { success: false, message: string }> {
    console.log(`item.upload isCreate: ${isCreate}, module: ${current.value.module}, fields: ${JSON.stringify(newFields, null, 2)}`)

    const res = await send2<TApiItemShow<TGenericFields>>('model/store', isCreate ? 'post' : 'put', { model: current.value.module, item: newFields, id: newFields.id })
    if (!res.success) {
      return res
    }


    if (isCreate) {
      setItemMedia([])
      saveitemFieldsPlus(res.data)
      const newIndex = pushToArray({ "id": res.data.fields.id, "slug": res.data.slug })
      itemIndex.value = newIndex
      //console.log(`item pushed to main array. index: ${itemIndex.value}`)
    } else {
      fields.value = res.data.fields
      slug.value = res.data.slug
    }

    return { success: true, slug: <string>slug.value }
  }

  function itemClear() {
    itemIndex.value = -1
    fields.value = undefined
    slug.value = undefined
    short.value = undefined
    tag.value = undefined
    selectedItemParams.value = []
  }

  function nextSlug(isRight: boolean) {
    let newIndex
    const length = collection('main').value.meta.length
    if (isRight) {
      newIndex = (itemIndex.value === length - 1) ? 0 : itemIndex.value + 1
    } else {
      newIndex = (itemIndex.value === 0) ? length - 1 : itemIndex.value - 1
    }

    const mainArrayItem = <TApiArrayMain>itemByIndex('main', newIndex)
    //console.log(`nextSlug: ${mainArrayItem.slug}`)
    return mainArrayItem.slug
  }

  async function itemRemove(): Promise<{ success: true, slug: string | null } | { success: false, message: string }> {
    const { removeItemFromArrayById } = useCollectionMainStore()
    const prev = next('main', itemIndexById((<TGenericFields>fields.value).id), false)


    const res = await send2<TApiItemShow<TGenericFields>>('model/destroy', 'post', { model: current.value.module, slug: slug.value, id: fields.value?.id })

    if (!res.success) {
      return res
    }

    console.log(`${current.value.module}item.itemRemove() success!`)
    const newLength = removeItemFromArrayById((<TGenericFields>fields.value).id)

    //return of slug === null means that is was the last element in the current array.
    if (newLength === 0) {
      return { success: true, slug: null }
    } else {
      return { success: true, slug: (<TApiArrayMain>prev.item).slug }
    }
  }

  return {
    slug,
    tag,
    short,
    ready,
    fields,
    id,
    derived,
    selectedItemParams,
    itemIndex,
    nextSlug,
    itemClear,
    itemViews,
    itemViewIndex,
    itemView,
    setItemViewIndex,
    saveitemFieldsPlus,
    upload,
    itemRemove
  }
})
