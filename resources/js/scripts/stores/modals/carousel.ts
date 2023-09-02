// stores/media.js
import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { TCollectionName, TApiArrayMain, TApiArrayMedia, TApiArray } from '@/js/types/collectionTypes'
import { TMediaRecord, TCarouselMain, TApiCarouselMain, TApiCarouselMedia, TMediaOfItem } from '@/js/types/mediaTypes'
import { TModule } from '@/js/types/routesTypes'


import { useCollectionsStore } from '../collections/collections'
import { useXhrStore } from '../xhr'
import { useNotificationsStore } from '../notifications'
import { useMediaStore } from '../media'
import { useModuleStore } from '../module'
import { useRoutesMainStore } from '../routes/routesMain'


export const useCarouselStore = defineStore('carousel', () => {
  let c = useCollectionsStore()
  const { send } = useXhrStore()
  const { showSpinner } = useNotificationsStore()
  const { current } = storeToRefs(useRoutesMainStore())
  const { buildMedia } = useMediaStore()
  const { tagFromSlug } = useModuleStore()

  let isOpen = ref<boolean>(false)
  let collectionName = ref<TCollectionName>('main')
  let index = ref<number>(-1)
  let media = ref<TMediaOfItem>({ hasMedia: false, urls: { full: "", tn: "" } })
  let itemDetails = ref<TCarouselMain | TMediaRecord | null>(null)

  const carouselHeader = computed(() => {
    if (!isOpen.value) { return undefined }
    let collection = c.collection(<TCollectionName>collectionName.value)
    let text = ""
    switch (collectionName.value) {
      case 'main':
        text = `${current.value.module} result set. Showing item "${(<TCarouselMain>itemDetails.value)?.tag}"`
        break
      case 'media':
        text = `Media for ${current.value.module} "${current.value.slug}"`
        break
    }
    return text + ` [${index.value + 1}/${collection.value.array.length}]`
  })

  const carouselGeneralDetails = computed(() => {
    if (!isOpen.value) { return undefined }

    return {
      indexB1: index.value + 1,
      collectionName: collectionName.value,
    }
  })

  async function open(source: TCollectionName, openIndex: number) {
    collectionName.value = source
    let item = c.itemByIndex(source, openIndex)
    console.log(`carousel.open() source: ${collectionName.value} index: ${openIndex} item: ${JSON.stringify(item, null, 2)}`)
    await load(c.itemByIndex(source, openIndex))
    index.value = openIndex
    isOpen.value = true
  }

  async function next(isRight: boolean) {
    const next = c.next(collectionName.value, index.value, isRight)
    await load(c.itemByIndex(collectionName.value, next.index))
    index.value = next.index
  }

  async function load(item: TApiArray) {
    let url = ""
    let data = { model: "", id: 0 }
    switch (collectionName.value) {
      case 'main':
        url = 'model/carousel'
        data["model"] = current.value.module
        data["id"] = (<TApiArrayMain>item).id

        break
      case 'media':
        url = 'media/carousel'
        data["id"] = item["id"]
        break
    }

    console.log(`carousel.load() url: ${url}. data: ${JSON.stringify(data, null, 2)}`)
    let res = await send(url, 'post', data)

    switch (collectionName.value) {
      case 'main':
        saveMain(res.data)
        break
      case 'media':
        saveMedia(res.data)
        break
    }
    showSpinner(false)
  }

  function saveMain(data: TApiCarouselMain) {
    media.value = buildMedia(data.media, current.value.module)
    itemDetails.value = {
      id: data.id,
      slug: data.slug,
      tag: tagFromSlug(current.value.module, data.slug),
      description: data.description,
      module: data.module
    }
  }

  function saveMedia(data: TApiCarouselMedia) {
    media.value = buildMedia({ full: data.full, tn: data.tn })
    itemDetails.value = {
      id: data.id,
      urls: { full: data.full, tn: data.tn },
      size: (data.size / 1000000).toFixed(2).toString() + 'MB',
      collection_name: data.collection_name,
      file_name: data.file_name,
      order_column: data.order_column,
      title: data.title,
      text: data.text
    }
  }

  async function close() {
    //if current carouselItem is in currently loaded page - close, otherwise, load relevant page
    switch (collectionName.value) {
      case 'main':
        if (!c.itemIsInPage(<number>itemDetails.value?.id)) {
          const index = c.itemIndexById(<number>itemDetails.value?.id)
          await c.loadPageByItemIndex(collectionName.value, 'Image', index, current.value.module)
            .then(res => {
              console.log(`carousel.close() loaded a new page`)
            })
            .catch(err => {
              console.log(`carousel.close() loaded a new page failed`)
              throw err
            })
            .finally(() => {
              showSpinner(false)
            })
        } else {
          console.log(`carousel.close() no need to load a new page`)
        }
        break;
      case 'media':
        console.log(`carousel.close() media not loading new page (YET)`)
    }
    isOpen.value = false
  }

  return {
    isOpen,
    collectionName,
    media,
    itemDetails,
    carouselHeader,
    carouselGeneralDetails,
    open,
    close,
    next,
  }
})
