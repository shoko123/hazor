// app.js

import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useXhrStore } from './xhr'
import { useAuthStore } from './auth'
import { useMediaStore } from './media'
export const useMainStore = defineStore('main', () => {

  let initialized = ref(false)
  const { bucketUrl } = storeToRefs(useMediaStore())
  const { accessibility } = storeToRefs(useAuthStore())
  
  async function appInit() {
    let xhr = useXhrStore()
    let auth = useAuthStore()

    return xhr.send('app/init', 'get')
    
      .then(res => {
        console.log(`Setting bucketUrl to ${res.data.bucketUrl}`)
        console.log(`Setting accessibility to ${JSON.stringify(res.data.accessibility, null, 2)}`)
        bucketUrl.value = res.data.bucketUrl
        accessibility.value = res.data.accessibility
        initialized.value = true
      })
      .catch(err => {
        console.log(`app/init failed with error: ${err}`)
        throw ("app.init() failed")
      })
  }
  return { initialized, appInit }
})

