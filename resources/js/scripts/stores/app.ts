// app.js
//Stores data common to the whole app:
//accessibility, bucketUrl, carousel, 
import { defineStore, storeToRefs } from 'pinia'
import { useXhrStore } from './xhr';

let xhr = useXhrStore()





export const useAppStore = defineStore('app', {
  state: () => {
    return { 
            accessibility: null,
            bucketUrl: null,
            carousel: 'xxx', }
  },
  
  actions: {
    appInit() {

  },
  },
})
