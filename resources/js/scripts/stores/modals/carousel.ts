// stores/media.js
import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { TCollectionName, TApiArrayMain, TApiArrayMedia } from '@/js/types/collectionTypes'
import { TApiShowCarousel } from '@/js/types/showTypes'
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

  let carousel = ref<TMediaProps>({
    source: 'main',
    itemIndex: -1,
    media: { hasMedia: false, urls: { full: "", tn: "" }, id: -1, description: "" },
    details: { id: -1, url_id: "", tag: "", description: "" }
  })

  const carouselHeader = computed(() => {
    let collection = c.collection(collectionName.value)
    return `Carousel Header ${module.value} [${carousel.value.itemIndex + 1}/${collection.value.array.length}]`
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

  async function open(source: TCollectionName, index: number) {
    module.value = current.value.module
    //carousel.value = { ...item }
    collectionName.value = source
    console.log(`carousel.open() source: ${source} index: ${index} module: ${module}`)



    switch (source) {
      case 'main':
        let url_id = (<TApiArrayMain>c.itemByIndex(source, index)).url_id
        await send('model/carousel', 'post', { model: current.value.module, url_id: url_id })
          .then(res => {
            console.log(`model.carousel()) returned (success). res: ${JSON.stringify(res.data, null, 2)}`)
            let resp = res.data.item as TApiShowCarousel
            carousel.value.itemIndex = index
            carousel.value.media = buildMedia(resp.media, current.value.module)
            carousel.value.details = { id: resp.id, url_id: resp.url_id, tag: resp.url_id, description: resp.description }
            isOpen.value = true
          })
          .catch(err => {
            console.log(`loadItem() failed`)
            throw err
          })
          .finally(() => {
            showSpinner(false)
          })
        break

      case 'media':

        let id = (<TApiArrayMedia>c.itemByIndex(source, index)).id
        await send('media/carousel', 'post', { id })
          .then(res => {
            console.log(`media.carousel() returned (success). res: ${JSON.stringify(res.data, null, 2)}`)

            carousel.value.itemIndex = index
            carousel.value.media = buildMedia(res.data.res, module.value)
            carousel.value.details = { id: -1, url_id: "url id", tag: "tag", description: "description" }
            isOpen.value = true
          })
          .catch(err => {
            console.log(`media.carousel() failed`)
            throw err
          })
          .finally(() => {
            showSpinner(false)
          })

    }

  }

  async function next(isRight: boolean) {
    const next = c.next(collectionName.value, carousel.value.itemIndex, isRight)

    console.log(`next.newItem: ${JSON.stringify(next, null, 2)}})`)

    switch (collectionName.value) {
      case 'main':


        showSpinner(`Loading next item...`)
        await send('model/carousel', 'post', { model: current.value.module, url_id: (<TApiArrayMain>next.item).id })
          .then(res => {
            console.log(`main.carousel() returned (success). res: ${JSON.stringify(res.data, null, 2)}`)
            let resp = res.data.item as TApiShowCarousel
            carousel.value.itemIndex = next.index
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
        break

      case 'media':
        showSpinner(`Loading next item...`)
        await send('media/carousel', 'post', { id: next.item.id })
          .then(res => {
            console.log(`main.carousel() returned (success). res: ${JSON.stringify(res.data, null, 2)}`)
            carousel.value.itemIndex = next.index
            carousel.value.media = buildMedia(res.data.res, current.value.module)
            carousel.value.details = { id: -1, url_id: "url id", tag: "tag", description: "description" }
          })
          .catch(err => {
            console.log(`loadItem() failed`)
            throw err
          })
          .finally(() => {
            showSpinner(false)
          })
        break

    }
  }


  async function close() {
    //if current carouselItem is in currently loaded page - close, otherwise, load relevant page
    switch (collectionName.value) {
      case 'main':
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
        break;
      case 'media':
        console.log(`carousel.close() media not loading new page (YET)`)
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
