// app.js
//Stores data common to the whole app:
//accessibility, bucketUrl, carousel, 
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useXhrStore } from './xhr'
export const useMainStore = defineStore('main', () => {
  let initialized = ref(false)
  let accessibility = ref({ authenticatedUsersOnly: true, readOnly: false })
  let bucketUrl = ref(null)
  let action = true

  async function appInit() {
    let xhr = useXhrStore()
    return xhr.send('app/init', 'get')
    .then(res => {
      bucketUrl.value = res.data.bucketUrl
      accessibility.value = res.data.accessibility
      initialized.value = true
    })
    .catch(err => {
      console.log(`app/init failed with error: ${err}`)
      throw ("app.init() failed")
    })
  }

  const isLoading = computed(() => {
    return action
  })

  const subMenu = computed(() => {
    return action
  })

  const authenticatedUsersOnly = computed(() => {
    return accessibility.value.authenticatedUsersOnly
  })

  return { initialized, accessibility, authenticatedUsersOnly, bucketUrl, appInit, isLoading, subMenu }
})

