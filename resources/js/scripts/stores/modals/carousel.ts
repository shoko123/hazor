// stores/media.js
import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { TCollectionName, TPageItemMedia, } from '../../../types/collectionTypes'
import { TDbShow1 } from '@/js/types/dbResponseTypes'
import { useCollectionsStore } from '../collections'
import { useXhrStore } from '../xhr'
import { useNotificationsStore } from '../notifications'
import { useMediaStore } from '../media'
import { useRoutesMainStore } from '../routes/routesMain'
import { TCarouselDetails } from '@/js/types/modalTypes'
import { TModule } from '@/js/types/routesTypes'
import { TMediaItem } from '@/js/types/mediaTypes'

export const useCarouselStore = defineStore('carousel', () => {

  let c = useCollectionsStore()
  const { send } = useXhrStore()
  const { showSpinner } = useNotificationsStore()
  const { current } = storeToRefs(useRoutesMainStore())
  const { getBucketUrl, buildMedia } = useMediaStore()

  let isOpen = ref<boolean>(false)

  let collectionName = ref<TCollectionName>('main')
  let carouselItemIndex = ref<number>(-1)
  let carouselItemModule = ref<TModule>('Home')
  let carouselItem = ref<TPageItemMedia>({ item: { id: -1, url_id: "", tag: "", description: "" }, media: { hasMedia: false, urls: { full: "", tn: "" } } })

  const carouselHeader = computed(() => {
    return `Carousel Header ${carouselItemModule.value} [${carouselItemIndex.value + 1}/${c.collectionMeta(collectionName.value).length}]`

  })

  const carouselDetails = computed<TCarouselDetails | undefined>(() => {
    if (!isOpen.value) { return undefined }
    return {
      carouselHeader: carouselHeader.value,
      itemIndexB1: carouselItemIndex.value + 1,
      itemTag: "my tag",
      itemDescription: carouselItem.value.item.description,
      itemUrlId: carouselItem.value.item.url_id,
      itemModule: carouselItemModule.value,
      media: carouselItem.value.media,
    }

  })

  async function open(source: TCollectionName, index: number, module: TModule, item: TPageItemMedia) {
    collectionName.value = source
    carouselItemIndex.value = index
    carouselItemModule.value = module
    carouselItem.value = item
    //const ids = c.itemIdsByIndex(source, index)
    console.log(`carousel.open() source: ${source} index: ${index} module: ${module} items: ${JSON.stringify(item, null, 2)}`)

    isOpen.value = true
  }

  function nextIndex(isRight: boolean) {
    let newIndex, meta = c.collectionMeta('main')

    if (isRight) {
      newIndex = (carouselItemIndex.value === meta.length - 1) ? 0 : carouselItemIndex.value + 1
    } else {
      newIndex = (carouselItemIndex.value === 0) ? meta.length - 1 : carouselItemIndex.value - 1
    }
    return newIndex
  }

  async function next(isRight: boolean) {
    // console.log(`next(${isRight ? "Right" : "Left"})`)    
    const newIndex = nextIndex(isRight)
    const ids = c.itemIdsByIndex('main', newIndex)
    showSpinner(`Loading next item...`)

    await send('model/show', 'post', { model: current.value.module, url_id: ids.url_id, level: 1 })
      .then(res => {
        console.log(`show(carouselItem) returned (success). res: ${JSON.stringify(res.data, null, 2)}`)
        let resp = res.data.item as TDbShow1
        carouselItemIndex.value = newIndex
        carouselItem.value = { item: { id: resp.id, url_id: resp.url_id, tag: resp.url_id, description: resp.description }, media: buildMedia(resp.media, current.value.module) }
        return true
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
    if (!c.itemIsInPage(carouselItem.value.item.id)) {
      const index = c.itemIndexById(carouselItem.value.item.id)
      await c.loadPageByItemIndex(current.value.module, index)
        .then(res => {
          console.log(`carousel.close() loaded a new page`)
          return true
        })
        .catch(err => {
          console.log(`loadPage() failed`)
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
    carouselItem,
    open,
    close,
    next,
  }
})
