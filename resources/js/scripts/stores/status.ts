// app.js
//Stores data common to the whole app:

import { defineStore } from 'pinia'
import { computed } from 'vue'

import { useRoutesMainStore } from './routes/routesMain'
export const useStatusStore = defineStore('status', () => {

  let { getModule } = useRoutesMainStore()
  

  const hasSubMenu = computed(() => {
    let module = getModule()
    return !(module === 'Home' || module === 'Auth')
  })

  return { hasSubMenu }
})

