// app.js
//Stores data common to the whole app:
//accessibility, bucketUrl, carousel, 
import { defineStore, storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useMainStore } from './main'
import { useModuleStore } from './module'
import { useRoutesMainStore } from './routes/routesMain'
import { useCollectionsStore} from './collections'
export const useStatusStore = defineStore('status', () => {

  let routes = useRoutesMainStore()
  let c = useCollectionsStore()
  

  const isLoading = computed(() => {
    return routes.isLoading
  })

  const hasSubMenu = computed(() => {
    return !(routes.current.module === 'Home' || routes.current.module === 'Auth')
  })

  return { isLoading, hasSubMenu }
})

