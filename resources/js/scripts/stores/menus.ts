// app.js
//Stores data common to the whole app:

import { defineStore } from 'pinia'
import { computed } from 'vue'

import { useRoutesMainStore } from './routes/routesMain'

type TMainMenu = 'Read' | 'Modify' | 'Admin'
export const useMenusStore = defineStore('menus', () => {
  let rms = useRoutesMainStore()

  const hasSubMenu = computed(() => {
    switch (rms.current.name) {
      case 'home':
      case 'register':
      case 'login':
      case 'create':
      case 'update':
      case 'tag':
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
      case 'create':
      case 'update':
      case 'tag':
        return 'Modify'

      default:
        return 'Read'
    }
  })


  return { hasSubMenu, mainMenuType }
})

