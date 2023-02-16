// app.js
//Stores data common to the whole app:

import { defineStore } from 'pinia'
import { computed } from 'vue'

import { useRoutesMainStore } from './routes/routesMain'

type TMainMenu = 'Read' | 'Modify' | 'Admin' | undefined
export const useMenusStore = defineStore('menus', () => {

  let rms = useRoutesMainStore()


  const hasSubMenu = computed(() => {
    let module = rms.current.module
    return !(module === 'Home' || module === 'Auth')
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
      default:
        return undefined
    }
  })


  return { hasSubMenu, mainMenuType }
})

