// stores/media.js
import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { TCollectionName, TApiArrayMain, TApiArrayRelated, TApiArray } from '@/js/types/collectionTypes'
import { TCarousel, TApiCarouselMain, TApiCarouselMedia, TMediaOfItem } from '@/js/types/mediaTypes'
import { useCollectionsStore } from '../collections/collections'
import { useCollectionMainStore } from '../collections/collectionMain'
import { useXhrStore } from '../xhr'
import { useNotificationsStore } from '../notifications'
import { useMediaStore } from '../media'
import { useModuleStore } from '../module'
import { useItemStore } from '../item'


export const useCarouselStore = defineStore('carousel', () => {
  let c = useCollectionsStore()
  let { extra } = storeToRefs(useCollectionMainStore())
  const { send } = useXhrStore()
  const { showSpinner } = useNotificationsStore()
  const { derived } = storeToRefs(useItemStore())
  const { buildMedia } = useMediaStore()
  const { tagFromSlug } = useModuleStore()

  let isOpen = ref<boolean>(false)
  let collectionName = ref<TCollectionName>('main')
  let index = ref<number>(-1)
  let carouselItemDetails = ref<TCarousel | null>(null)

  const showNextArrows = computed(() => {
    if (!isOpen.value) { return false }
    let collection = c.collection(<TCollectionName>collectionName.value)
    return collection.value.array.length > 1
  })

  async function open(source: TCollectionName, openIndex: number) {
    collectionName.value = source
    //console.log(`carousel.open() source: ${collectionName.value} index: ${openIndex} item: ${JSON.stringify(item, null, 2)}`)
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

    //related carousel item needs no DB access
    if (collectionName.value === 'related') {
      carouselItemDetails.value = { ...(<TApiArrayRelated>item), tag: tagFromSlug(derived.value.module, (<TApiArrayRelated>item).slug), media: buildMedia((<TApiArrayRelated>item).media, (<TApiArrayRelated>item).module) }
    } else {
      url = collectionName.value === 'main' ? 'model/carousel' : 'media/carousel'
      data["model"] = derived.value.module
      data["id"] = collectionName.value === 'main' ? (<TApiArrayMain>item).id : item["id"]
      showSpinner(`Loading item`)
      let res = await send(url, 'post', data)
      if (collectionName.value === 'main') {
        saveMain(res.data)
      } else {
        saveMedia(res.data)
      }
    }

    //console.log(`carousel.load() url: ${url}. data: ${JSON.stringify(data, null, 2)}`)
    showSpinner(false)
  }

  function saveMain(data: TApiCarouselMain) {
    carouselItemDetails.value = {
      module: data.module,
      id: data.id,
      slug: data.slug,
      tag: tagFromSlug(derived.value.module, data.slug),
      short: data.short,
      media: buildMedia(data.urls, derived.value.module)
    }
  }

  function saveMedia(data: TApiCarouselMedia) {
    carouselItemDetails.value = {
      id: data.id,
      media: buildMedia(data.urls),
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
        let view = extra.value.views[extra.value.viewIndex]

        if (!c.itemIsInPage(<number>carouselItemDetails.value?.id)) {
          const index = c.itemIndexById(<number>carouselItemDetails.value?.id)
          await c.loadPageByItemIndex(collectionName.value, view, index, derived.value.module)
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
    carouselItemDetails,
    //carouselHeader,
    showNextArrows,
    index,
    open,
    close,
    next,
  }
})
