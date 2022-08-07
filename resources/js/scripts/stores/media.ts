// stores/media.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMediaStore = defineStore('media', () => {
  let carousel = ref('xxx')
  return { carousel }
})