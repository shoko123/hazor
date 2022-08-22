// app.js

import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useXhrStore } from './xhr'
import { useAuthStore } from './auth'
import { useMediaStore } from './media'
import { useCollectionsStore } from './collections'

export const useMainStore = defineStore('main', () => {
  const { bucketUrl } = storeToRefs(useMediaStore())
  const { accessibility } = storeToRefs(useAuthStore())
  const { itemsPerPage } = storeToRefs(useCollectionsStore())
  const { send } = useXhrStore()

  let initialized = ref(false)

  async function appInit() {

    return send('app/init', 'get')
      .then(res => {
        console.log(`app.init() Setting basic configs: ${JSON.stringify(res.data, null, 2)}`)
        bucketUrl.value = res.data.bucketUrl
        accessibility.value = res.data.accessibility
        itemsPerPage.value = res.data.itemsPerPage
        initialized.value = true
      })
      .catch(err => {
        console.log(`app/init failed with error: ${err}`)
        throw ("app.init() failed")
      })
  }
  return { initialized, appInit }
})

