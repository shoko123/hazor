// stores/media.js
import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { TCollectionName, TApiArrayMain, TApiArrayMedia } from '@/js/types/collectionTypes'
import { TCarousel, TCarouselMedia, TCarouselMain, TImageableDetailsMain, TMedia } from '@/js/types/mediaTypes'
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

    switch (source) {
      
      case 'main':
        let url_id = (<TApiArrayMain>c.itemByIndex(source, openIndex)).url_id
        await send('model/carousel', 'post', { model: current.value.module, url_id: url_id })
          .then(res => {
            console.log(`model.carousel()) returned (success). res: ${JSON.stringify(res.data, null, 2)}`)
            media.value = buildMedia(res.data.item.media, current.value.module)
            mainDetails.value.description = res.data.item.description
            mainDetails.value.id = res.data.item.id
            mainDetails.value.module = current.value.module
            mainDetails.value.url_id = res.data.item.url_id
            index.value = openIndex
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
        let item = (<TApiArrayMedia>c.itemByIndex(source, openIndex))
        console.log(`media.item (from array): ${JSON.stringify(item, null, 2)}`)
        //let id = (<TApiArrayMedia>c.itemByIndex(source, index)).id

        await send('media/carousel', 'post', { id: item })
          .then(res => {
            console.log(`media.carousel() returned (success). res: ${JSON.stringify(res.data, null, 2)}`)


            media.value = buildMedia(res.data.res)
            mediaDetails.value.description = res.data.res.description
            mediaDetails.value.id = res.data.res.id
            mediaDetails.value.collection_name = res.data.res.collection_name
            index.value = openIndex
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
    const next = c.next(collectionName.value, index.value, isRight)

    console.log(`next.newItem: ${JSON.stringify(next, null, 2)}})`)

    switch (collectionName.value) {
      case 'main':
        showSpinner(`Loading next item...`)
        await send('model/carousel', 'post', { model: current.value.module, url_id: (<TApiArrayMain>next.item).id })
          .then(res => {
            console.log(`main.carousel() returned (success). res: ${JSON.stringify(res.data, null, 2)}`)
            media.value = buildMedia(res.data.item.media, current.value.module)
            mainDetails.value.description = res.data.item.description
            mainDetails.value.id = res.data.item.id
            mainDetails.value.url_id = res.data.item.url_id
            mainDetails.value.module = current.value.module          
            index.value = next.index
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
        await send('media/carousel', 'post', { id: next.item })
          .then(res => {
            console.log(`main.carousel() returned (success). res: ${JSON.stringify(res.data, null, 2)}`)
            media.value = buildMedia(res.data.res, current.value.module)
            mediaDetails.value.description = res.data.res.description
            mediaDetails.value.id = res.data.res.id
            index.value = next.index
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

  async function load() {

  }
  async function save() {

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
