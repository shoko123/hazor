// app.js
//Stores data common to the whole app:

import { defineStore } from 'pinia'
import { computed } from 'vue'

import { useRoutesMainStore } from './routes/routesMain'

type TMainMenu = 'Read' | 'Modify' | 'Admin' | 'Auth'

export const useMenusStore = defineStore('menus', () => {
  let rms = useRoutesMainStore()

  const hasSubMenu = computed(() => {
    switch (rms.current.name) {
      case 'home':
      case 'register':
      case 'login':
      case 'forgot-password':
      case 'reset-password':
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

      case 'register':
      case 'login':
      case 'forgot-password':
      case 'reset-password':
        return 'Auth'

      default:
        return 'Read'
    }
  })


  return { hasSubMenu, mainMenuType }
})

