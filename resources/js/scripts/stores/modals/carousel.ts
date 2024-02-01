// stores/media.js
import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { TCollectionName, TApiArrayMain, TApiArrayRelated, TApiArray } from '@/js/types/collectionTypes'
import { TCarousel, TApiCarouselMain, TApiCarouselMedia } from '@/js/types/mediaTypes'
import { useCollectionsStore } from '../collections/collections'
import { useCollectionMainStore } from '../collections/collectionMain'
import { useXhrStore } from '../xhr'
import { useNotificationsStore } from '../notifications'
import { useMediaStore } from '../media'
import { useModuleStore } from '../module'
import { useItemStore } from '../item'
import { useRoutesMainStore } from '../routes/routesMain'

export const useCarouselStore = defineStore('carousel', () => {
  const c = useCollectionsStore()
  const { extra } = storeToRefs(useCollectionMainStore())
  const { send2 } = useXhrStore()
  const { showSpinner, showSnackbar } = useNotificationsStore()
  const { derived } = storeToRefs(useItemStore())
  const { buildMedia } = useMediaStore()
  const { tagFromSlug } = useModuleStore()
  const { routerPush } = useRoutesMainStore()
  const isOpen = ref<boolean>(false)
  const collectionName = ref<TCollectionName>('main')
  const index = ref<number>(-1)
  const carouselItemDetails = ref<TCarousel | null>(null)

  const arrayLength = computed(() => {
    const collection = c.collection(<TCollectionName>collectionName.value)
    return collection.value.array.length
  })


  async function open(source: TCollectionName, openIndex: number) {
    collectionName.value = source
    //console.log(`carousel.open() source: ${collectionName.value} index: ${openIndex}`)
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
    // let sendParams = { url = ''
    if (collectionName.value === 'related') {

      const tmp = <TApiArrayRelated>item
      carouselItemDetails.value = { ...tmp, tag: tagFromSlug(tmp.module, tmp.slug), media: buildMedia(tmp.media, tmp.module) }
    }
    else {
      showSpinner(`Loading item`)
      if (collectionName.value === 'main') {
        const res = await send2<TApiCarouselMain>('model/carousel', 'post', { id: (<TApiArrayMain>item).id, model: derived.value.module })
        if (res.success) {
          carouselItemDetails.value = {
            module: res.data.module,
            id: res.data.id,
            slug: res.data.slug,
            tag: tagFromSlug(derived.value.module, res.data.slug),
            short: res.data.short,
            media: buildMedia(res.data.urls, derived.value.module)
          }
        } else {
          showSnackbar('Failed to load carousel item. Redirected to home page.')
          routerPush('home')
        }
      } else {
        showSpinner(`Loading item`)
        const res = await send2<TApiCarouselMedia>('media/carousel', 'post', { id: item.id })
        if (res.success) {
          carouselItemDetails.value = {
            id: item.id,
            tag: <string>derived.value.tag,
            media: buildMedia(res.data.urls),
            size: (res.data.size / 1000000).toFixed(2).toString() + 'MB',
            collection_name: res.data.collection_name,
            file_name: res.data.file_name,
            order_column: res.data.order_column,
            title: res.data.title,
            text: res.data.text
          }
        } else {
          showSnackbar('Failed to load carousel item. Redirected to home page.')
          routerPush('home')
        }
      }
      showSpinner(false)
    }

  }

  async function close() {
    //if current carouselItem is in currently loaded page - close, otherwise, load relevant page
    if (collectionName.value === 'main') {
      const view = extra.value.views[extra.value.viewIndex]
      if (!c.itemIsInPage(<number>carouselItemDetails.value?.id)) {
        const index = c.itemIndexById(<number>carouselItemDetails.value?.id)
        await c.loadPageByItemIndex(collectionName.value, view, index, derived.value.module)
          .then(() => {
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
    } else if (collectionName.value === 'media') {
      console.log(`carousel.close() media not loading new page (YET)`)
    }
    isOpen.value = false
  }

  return {
    isOpen,
    collectionName,
    carouselItemDetails,
    arrayLength,
    index,
    open,
    close,
    next,
  }
})
