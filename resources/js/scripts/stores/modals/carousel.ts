// stores/media.js
import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { TCollectionName, TPageCMainVImage, } from '../../../types/collectionTypes'
import { TApiRespShow1 } from '@/js/types/apiTypes'
import { useCollectionsStore } from '../collections/collections'
import { useXhrStore } from '../xhr'
import { useNotificationsStore } from '../notifications'
import { useMediaStore } from '../media'
import { useRoutesMainStore } from '../routes/routesMain'
import { TCarouselDetails } from '@/js/types/modalTypes'
import { TModule } from '@/js/types/routesTypes'
import { TMedia, TMediaProps, TMediaDetailsCMain } from '@/js/types/mediaTypes'

export const useCarouselStore = defineStore('carousel', () => {
  let c = useCollectionsStore()
  const { send } = useXhrStore()
  const { showSpinner } = useNotificationsStore()
  const { current } = storeToRefs(useRoutesMainStore())
  const { getBucketUrl, buildMedia } = useMediaStore()

  let isOpen = ref<boolean>(false)
  let module = ref<TModule>('Home')
  let collectionName = ref<TCollectionName>('main')

  let carousel = ref<TMediaProps>({ source: 'main', itemIndex: -1, media: { hasMedia: false, urls: { full: "", tn: "" } }, details: { id: -1, url_id: "", tag: "", description: "" } })

  const carouselHeader = computed(() => {
    return `Carousel Header ${module.value} [${carousel.value.itemIndex + 1}/${c.collection(carousel.value.source).value.meta.length}]`
  })

  const carouselDetails = computed<TCarouselDetails | undefined>(() => {
    if (!isOpen.value) { return undefined }
    let details = carousel.value.details as TMediaDetailsCMain
    return {
      carouselHeader: carouselHeader.value,
      itemIndexB1: carousel.value.itemIndex + 1,
      itemTag: "my tag",
      itemDescription: details.description,
      itemUrlId: details.url_id,
      itemModule: module.value,
      media: carousel.value.media,
    }
  })

  async function open(source: TCollectionName, index: number, mod: TModule, item: TMediaProps) {
    module.value = mod
    carousel.value = { ...item }
    collectionName.value = source
    console.log(`carousel.open() source: ${source} index: ${index} module: ${module} items: ${JSON.stringify(item, null, 2)}`)
    isOpen.value = true
  }

  function nextIndex(isRight: boolean) {
    let length = c.collection(carousel.value.source).value.meta.length
    let newIndex

    if (isRight) {
      newIndex = (carousel.value.itemIndex === length - 1) ? 0 : carousel.value.itemIndex + 1
    } else {
      newIndex = (carousel.value.itemIndex === 0) ? length - 1 : carousel.value.itemIndex - 1
    }
    return newIndex
  }

  async function next(isRight: boolean) {
    // console.log(`next(${isRight ? "Right" : "Left"})`)    
    const newIndex = nextIndex(isRight)
    const ids = c.itemIdsByIndex(carousel.value.source, newIndex)
    showSpinner(`Loading next item...`)

    await send('model/show', 'post', { model: current.value.module, url_id: ids.url_id, variant: 1 })
      .then(res => {
        console.log(`show(carouselItem) returned (success). res: ${JSON.stringify(res.data, null, 2)}`)
        let resp = res.data.item as TApiRespShow1
        carousel.value.itemIndex = newIndex
        carousel.value.media = buildMedia(resp.media, current.value.module)
        carousel.value.details = { id: resp.id, url_id: resp.url_id, tag: resp.url_id, description: resp.description }
      })
      .catch(err => {
        console.log(`loadItem() failed`)
        throw err
      })
      .finally(() => {
        showSpinner(false)
      })
  }

  async function close() {
    //if current carouselItem is in currently loaded page - close, otherwise, load relevant page
    if (!c.itemIsInPage(carousel.value.details.id)) {
      const index = c.itemIndexById(carousel.value.details.id)
      await c.loadPageByItemIndex(collectionName.value, 'Image', index, current.value.module)
        .then(res => {
          console.log(`carousel.close() loaded a new page`)
        })
        .catch(err => {
          console.log(`loadPageByItemIndex() failed`)
          throw err
        })
        .finally(() => {
          showSpinner(false)
        })
    } else {
      console.log(`carousel.close() no need to load a new page`)
    }
    isOpen.value = false
  }

  return {
    carouselDetails,
    isOpen,
    open,
    close,
    next,
  }
})
