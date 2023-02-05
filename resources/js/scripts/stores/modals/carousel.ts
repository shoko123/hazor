// stores/media.js
import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'

import { TCollectionName, } from '../../../types/collectionTypes'

import { useCollectionsStore } from '../collections'
import { useXhrStore } from '../xhr'
import { useNotificationsStore } from '../notifications';
import { useRoutesMainStore } from '../routes/routesMain'
import { TModule } from '@/js/types/routesTypes'

export const useCarouselStore = defineStore('carousel', () => {

  let c = useCollectionsStore()
  const { send } = useXhrStore()
  const { showSpinner } = useNotificationsStore()
  const { current } = storeToRefs(useRoutesMainStore())


  let isOpen = ref<boolean>(false)

  let collectionName = ref<TCollectionName>('main')
  let carouselIndex = ref<number>(-1)
  let carouselModule = ref<string>("")
  let currentItem = ref({ tag: "my tag", description: "description", id: 5, url_id: "url_id:6" })
  const currentMedia = ref({
    hasMedia: true,
    urls: {
      full: 'https://picsum.photos/510/300?random',
      tn: 'https://picsum.photos/510/300?random'
    },
  })

  const carouselHeader = computed(() => {
    return `Carousel Header ${carouselModule.value} [${carouselIndex.value + 1}/${c.collectionMeta(collectionName.value).length}]`

  })



  const carouselInfo = computed(() => {
    return {
      isOpen: isOpen.value,
      carouselHeader: carouselHeader.value,
      length: 0,
      indexB1: carouselIndex.value + 1,
      item: currentItem.value,
      media: currentMedia.value,
    }

  })

  async function open(source: TCollectionName, index: number, module: TModule) {
    collectionName.value = source
    carouselIndex.value = index
    carouselModule.value = module
    const ids = c.itemIdsByIndex(source, index)
    console.log(`carousel.open() source: ${source} index: ${index} module: ${module} itemIds: ${JSON.stringify(ids, null, 2)}`)

    isOpen.value = true
  }

  async function next(isRight: boolean) {
    console.log(`next(${isRight ? "Right" : "Left"})`)

    showSpinner(`Loading...`)

    await send('model/show', 'post', { model: current.value.url_module, url_id: current.value.url_id, level: 0 })
      .then(res => {
        console.log(`show() returned (success)`)
        console.log(`show() returned (success). res: ${JSON.stringify(res, null, 2)}`)

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
  function close() {
    isOpen.value = false
  }
  return { carouselInfo, open, close, next }
})
