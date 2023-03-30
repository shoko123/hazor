// stores/media.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { TMedia } from '@/js/types/mediaTypes'
import { TModule } from '@/js/types/routesTypes'
import { TApiMedia } from '@/js/types/apiTypes'
import { useRoutesMainStore } from './routes/routesMain'
import { useXhrStore } from './xhr'

export const useMediaStore = defineStore('media', () => {

  let bucketUrl = ref("")

  function getBucketUrl() {
    return bucketUrl.value
  }

  function setBucketUrl(burl: string) {
    bucketUrl.value = burl
  }

  function buildMedia(dbMedia: TApiMedia, module: TModule): TMedia {
    if (dbMedia === null || dbMedia === undefined) {
      return {
        hasMedia: false,
        urls: {
          full: `${bucketUrl.value}app/filler/${module}Filler.jpg`,
          tn: `${bucketUrl.value}app/filler/${module}Filler-tn.jpg`
        }
      }
    } else {
      return {
        hasMedia: true,
        urls: {
          full: `${bucketUrl.value}${dbMedia.full}`,
          tn: `${bucketUrl.value}${dbMedia.tn}`
        }
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

  const showUploader = ref<boolean>(false)
 
  return { setBucketUrl, getBucketUrl, buildMedia, showUploader, getMediaCollectionsNames, getMediaCollection, setMediaCollection }
})
