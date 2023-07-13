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
import { useModuleStore } from '../module'
import { useRoutesMainStore } from '../routes/routesMain'


export const useCarouselStore = defineStore('carousel', () => {
  let c = useCollectionsStore()
  const { send } = useXhrStore()
  const { showSpinner } = useNotificationsStore()
  const { current } = storeToRefs(useRoutesMainStore())
  const { buildMedia } = useMediaStore()
 const { tagFromUrlId } = useModuleStore()

  let isOpen = ref<boolean>(false)
  let collectionName = ref<TCollectionName>('main')
  let index = ref<number>(-1)
  let media = ref<TMedia>({ hasMedia: false, urls: { full: "", tn: "" } })

  let mainDetails = ref<TCarouselMain>({
    id: 0,
    slug: "",
    tag: "",
    description: "",
    module: undefined
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
        text = `${current.value.module} result set. Showing item "${mainDetails.value.slug}"`
        break
      case 'media':
        text = `Media for ${current.value.module} "${current.value.slug}"`
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
    mainDetails.value.slug = data.slug
    mainDetails.value.tag = tagFromUrlId(current.value.module, data.slug)
    mainDetails.value.slug = data.slug

    mainDetails.value.description = data.description
    
    mediaDetails.value.description = ""
    mediaDetails.value.id = 0
    mediaDetails.value.collection_name = ""
    mediaDetails.value.order_column= 0
  }
  function saveMedia(data: TApiCarouselMedia) {
    media.value = buildMedia({ full: data.full, tn: data.tn })
    mediaDetails.value.description = data.description
    mediaDetails.value.id = data.id
    mediaDetails.value.collection_name = data.collection_name
    mediaDetails.value.order_column= data.order_column

    mainDetails.value.id = 0
    mainDetails.value.slug = ""
    mainDetails.value.tag = ""
    mainDetails.value.module = undefined
    mainDetails.value.description = ""
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
