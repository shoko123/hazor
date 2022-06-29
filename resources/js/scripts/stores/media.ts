// stores/media.js
import { defineStore } from 'pinia'

export const useMediaStore = defineStore('media', {
  state: () => {
    return { carousel: 'xxx' }
  },
  //You can also define states this way
  // state: () => ({ count: 0 })
  actions: {
    setCarousel() {
      this.carousel = 'ggg'
    },
  },
})