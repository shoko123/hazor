// stores/media.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModelStore = defineStore('model', () => {
  let carousel = ref('xxx')
  return { carousel }
})