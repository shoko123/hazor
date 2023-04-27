// stores/media.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { TMedia } from '@/js/types/mediaTypes'
import { TModule } from '@/js/types/routesTypes'
import { TApiMediaOrNull } from '@/js/types/collectionTypes'
import { useRoutesMainStore } from './routes/routesMain'
import { useXhrStore } from './xhr'
import { useNotificationsStore } from '@/js/scripts/stores/notifications'
export const useMediaStore = defineStore('media', () => {

  let bucketUrl = ref("")
  const showUploader = ref<boolean>(false)
  
  function getBucketUrl() {
    return bucketUrl.value
  }

  function setBucketUrl(burl: string) {
    bucketUrl.value = burl
  }

  function buildMedia(apiMedia: TApiMediaOrNull, module?: TModule): TMedia {
    if (apiMedia === null || apiMedia === undefined) {
      return {
        hasMedia: false,
        urls: {
          full: `${bucketUrl.value}app/filler/${module}Filler.jpg`,
          tn: `${bucketUrl.value}app/filler/${module}Filler-tn.jpg`
        },
      }
    } else {
      return {
        hasMedia: true,
        urls: {
          full: `${bucketUrl.value}${apiMedia.full}`,
          tn: `${bucketUrl.value}${apiMedia.tn}`
        },
      }
    }
  }

  //Media Collections

  type TMediaCollectionName = 'photos' | 'drawings' | 'photosAndDrawings' | 'plans'
  type TMediaCollection = { name: TMediaCollectionName, label: string }
  type TMediaCollectionWithIndex = { index: number, name: TMediaCollectionName, label: string }
 

  const mediaCollections = ref<TMediaCollection[]>([
    { name: 'photos', label: 'Photo(s)' },
    { name: 'drawings', label: 'Drawings(s)' },
    { name: 'photosAndDrawings', label: 'Photo+Drawing(s)' },
    { name: 'plans', label: 'Plan(s)' },
  ])

  const mediaCollectionIndex = ref<number>(0)

  const getMediaCollectionsNames = computed((): TMediaCollectionWithIndex[] => {
    return mediaCollections.value.map((x, index) => { return { ...x, index } })
  })

  const getMediaCollection = computed(() => {
    return mediaCollections.value[mediaCollectionIndex.value].label
  })

  function setMediaCollection(index: number) {
    mediaCollectionIndex.value = index
    console.log(`set mediaCollection to ${index}`)
  }
 
  return { setBucketUrl, getBucketUrl, buildMedia, showUploader, getMediaCollectionsNames, getMediaCollection, setMediaCollection }
})
