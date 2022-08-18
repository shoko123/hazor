// stores/media.js
import { ref } from 'vue'
import { defineStore } from 'pinia'


export const useMediaStore = defineStore('media', () => {

  let bucketUrl = ref('')

  
  return { bucketUrl }
})
