// stores/media.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useModuleStore } from '../module'
import { TCollectionName, } from '../../../types/collectionTypes'


export const useCarouselStore = defineStore('carousel', () => {

  let isOpen = ref<boolean>(false)
  let collectionSource = ref<TCollectionName | false>(false)
  let carouselIndex = ref<number>(-1)

  const carouselInfo = computed(() => {
    return {
      isOpen: isOpen.value,
      header: "carousel header",
      length: 100,
      indexB1: 5,
      hasMedia: true,
      urls: {
        full: 'https://picsum.photos/510/300?random',
        tn: 'https://picsum.photos/510/300?random'
      }
    }
  })

  function open(source: TCollectionName, index: number) {
    console.log(`carousel.open() source: ${source} index: ${index}`)
    isOpen.value = true
  }
  function close() {
    isOpen.value = false
  }
  return { carouselInfo, open, close }
})
