// stores/media.js
import { ref } from 'vue'
import { defineStore } from 'pinia'


export const useMediaStore = defineStore('media', () => {

  let bucketUrl = ref('')
  function getBucketUrl()  {
    return bucketUrl.value
  }
  
  return { bucketUrl, getBucketUrl }
})
