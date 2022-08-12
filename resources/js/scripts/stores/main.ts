// app.js

import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useXhrStore } from './xhr'
import { useAuthStore } from './auth'

export const useMainStore = defineStore('main', () => {

  let initialized = ref(false)
  let bucketUrl = ref(null)

  async function appInit() {
    let xhr = useXhrStore()
    let auth = useAuthStore()
    
    return xhr.send('app/init', 'get')
      .then(res => {
        bucketUrl.value = res.data.bucketUrl
        auth.accessibility = res.data.accessibility
        initialized.value = true
      })
      .catch(err => {
        console.log(`app/init failed with error: ${err}`)
        throw ("app.init() failed")
      })
  }
  return { initialized, bucketUrl, appInit }
})

