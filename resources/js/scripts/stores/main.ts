// app.js
//Stores data common to the whole app:
//accessibility, bucketUrl, carousel, 
import { defineStore, storeToRefs } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => {
    return {
      accessibility: null,
      bucketUrl: null,
      action: true
    }
  },

  actions: {
    appInit(data: any) {
      this.$state.accessibility = data.accessibility
      this.$state.bucketUrl = data.bucketUrl

    },
  },
  getters: {
    carousel: (state) => "I am carousel from mainStore",
    subMenu: (state) => state.action
  },
})
