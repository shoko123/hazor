// stores/media.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { TMediaItem } from '@/js/types/mediaTypes'
import { TModule } from '@/js/types/routesTypes'
import { TDbPrimaryMedia } from '@/js/types/dbResponseTypes'
export const useMediaStore = defineStore('media', () => {

  let bucketUrl = ref("")

  function getBucketUrl() {
    return bucketUrl.value
  }

  function setBucketUrl(burl: string) {
    bucketUrl.value = burl
  }

  function buildMedia(dbMedia: TDbPrimaryMedia, module: TModule): TMediaItem {
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
          full: `${bucketUrl.value}db/${dbMedia.full}`,
          tn: `${bucketUrl.value}db/${dbMedia.tn}`
        }
      }
    }
  }
  return { setBucketUrl, getBucketUrl, buildMedia }
})
