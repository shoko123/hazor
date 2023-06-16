// app.js

import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useXhrStore } from './xhr'
import { useAuthStore } from './auth'
import { useMediaStore } from './media'
import { useCollectionsStore } from './collections/collections'

export const useMainStore = defineStore('main', () => {
  const { initMedia } = useMediaStore()
  const a = useAuthStore()
  const { setItemsPerPage } = useCollectionsStore()
  const { send } = useXhrStore()

  let initialized = ref(false)

  async function appInit() {

    return send('app/init', 'get')
      .then(res => {
        console.log(`app.init() Setting basic configs: ${JSON.stringify(res.data, null, 2)}`)
        initMedia(res.data.bucketUrl, res.data.media_collections)
        a.accessibility = res.data.accessibility
        setItemsPerPage(res.data.itemsPerPage)
        initialized.value = true
      })
      .catch(err => {
        console.log(`app/init failed with error: ${err}`)
        throw ("app.init() failed")
      })
  }
  

  return { initialized, appInit }
})

