// app.js
//Stores data common to the whole app:

import { defineStore } from 'pinia'
import { computed } from 'vue'

import { useRoutesMainStore } from './routes/routesMain'

type TMainMenu = 'Read' | 'Media' | 'Modify' | 'Admin' | undefined
export const useMenusStore = defineStore('menus', () => {

  let rms = useRoutesMainStore()


  const hasSubMenu = computed(() => {
    switch (rms.current.name) {
      case 'home':
      case 'login':
      case 'media':
      case 'update':
        return false

      default:
        return true
    }

  })

  const mainMenuType = computed((): TMainMenu => {
    let routeName = rms.current.name
    switch (routeName) {
      case 'home':
      case 'welcome':
      case 'index':
      case 'show':
      case 'filter':
        return 'Read'
      case 'media':
        return 'Media'
      case 'create':
      case 'update':
        return 'Modify'
      default:
        return undefined
    }
  })


  return { hasSubMenu, mainMenuType }
})

