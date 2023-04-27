// stores/media.js
import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { TCollectionName, TApiArrayMain, TApiArrayMedia, TApiArray } from '@/js/types/collectionTypes'
import { TCarousel, TCarouselMedia, TCarouselMain, TApiCarouselMain, TApiCarouselMedia, TMedia } from '@/js/types/mediaTypes'
import { TModule } from '@/js/types/routesTypes'


import { useCollectionsStore } from '../collections/collections'
import { useXhrStore } from '../xhr'
import { useNotificationsStore } from '../notifications'
import { useMediaStore } from '../media'
import { useRoutesMainStore } from '../routes/routesMain'


export const useCarouselStore = defineStore('carousel', () => {
  let c = useCollectionsStore()
  const { send } = useXhrStore()
  const { showSpinner } = useNotificationsStore()
  const { current } = storeToRefs(useRoutesMainStore())
  const { buildMedia } = useMediaStore()

  let isOpen = ref<boolean>(false)
  let collectionName = ref<TCollectionName>('main')
  let index = ref<number>(-1)
  let media = ref<TMedia>({ hasMedia: false, urls: { full: "", tn: "" } })

  let mainDetails = ref<TCarouselMain>({
    id: 0,
    url_id: "",
    description: "",
    module: 'Locus'
  })

  let mediaDetails = ref<TCarouselMedia>({
    id: 0,
    description: "",
    collection_name: "",
    order_column: 0
  })



  const carouselHeader = computed(() => {
    if (!isOpen.value) { return undefined }
    let collection = c.collection(<TCollectionName>collectionName.value)
    let text = ""
    switch (collectionName.value) {
      case 'main':
        text = `${mainDetails.value.module} result set. Showing item "${mainDetails.value.url_id}"`
        break
      case 'media':
        text = `Media for ${current.value.module} "${current.value.url_id}"`
        break
    }
    return text + ` [${index.value + 1}/${collection.value.array.length}]`
  })

  const carouselItemDetails = computed<TCarouselMain | TCarouselMedia | undefined>(() => {
    if (!isOpen.value) { return undefined }
    switch (collectionName.value) {
      case 'main':
        return mainDetails.value
      case 'media':
        return mediaDetails.value
      default:
        return undefined
    }
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
    console.log(`carousel.open() source: ${collectionName.value} index: ${openIndex}`)
    let item = c.itemByIndex(source, openIndex)
    console.log(`model.open() item: ${JSON.stringify(item, null, 2)}`)
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
    let data = { model: "", url_id: "", id: 0 }
    switch (collectionName.value) {
      case 'main':
        url = 'model/carousel'
        data["model"] = current.value.module
        data["url_id"] = (<TApiArrayMain>item).url_id
        break
      case 'media':
        url = 'media/carousel'
        data["id"] = <TApiArrayMedia>item
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
    mainDetails.value.id = data.id
    mainDetails.value.url_id = data.url_id
    mainDetails.value.module = data.module
    mainDetails.value.description = data.description

  }
  function saveMedia(data: TApiCarouselMedia) {
    media.value = buildMedia({ full: data.full, tn: data.tn }, current.value.module)
    mediaDetails.value.description = data.description
    mediaDetails.value.id = data.id
  }

  async function close() {
    //if current carouselItem is in currently loaded page - close, otherwise, load relevant page
    switch (collectionName.value) {
      case 'main':
        if (!c.itemIsInPage(mainDetails.value.id)) {        
          const index = c.itemIndexById(mainDetails.value.id)
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
    mainDetails,
    mediaDetails,
    carouselHeader,
    carouselItemDetails,
    carouselGeneralDetails,
    open,
    close,
    next,
  }
})
