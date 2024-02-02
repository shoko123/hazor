import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useXhrStore } from './xhr'
import { useAuthStore } from './auth'
import { useMediaStore } from './media'

type TAppInitResultData = {
  appUrl: string,
  bucketUrl: string,
  accessibility: {
    readOnly: boolean,
    authenticatedUsersOnly: boolean
  },
  media_collections: string[],
  msg: string
}

export const useMainStore = defineStore('main', () => {
  const { initMedia } = useMediaStore()
  const { accessibility } = storeToRefs(useAuthStore())
  const { send2 } = useXhrStore()

  const initialized = ref(false)

  async function appInit() {
    const res = await send2<TAppInitResultData>('app/init', 'get')
    if (res.success) {
      const data = <TAppInitResultData>res.data
      initMedia(data.bucketUrl, data.media_collections)
      accessibility.value = data.accessibility
      initialized.value = true
    } else {
      console.log(`app/init failed status: ${res.status} message: ${res.message}`)
      throw ("app.init() failed")
    }
  }

  return { initialized, appInit }
})

