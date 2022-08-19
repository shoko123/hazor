// app.js
//Stores data common to the whole app:
//accessibility, bucketUrl, carousel, 
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useMainStore } from './main'
import { useModuleStore } from './module'
import { useRoutesStore } from './routes/routesMain'
import { useCollectionsStore} from './collections'
export const useStatusStore = defineStore('status', () => {

  let routes = useRoutesStore()
  let c = useCollectionsStore()
  let { collectionMain } = storeToRefs(useCollectionsStore())
  const { getCollection } = c
  //let m = useModuleStore()

  const isLoading = computed(() => {
    return routes.isLoading
  })

  const module = computed(() => {
    return { name: routes.current.module }
  })

  const hasSubMenu = computed(() => {
    return !(routes.current.module === 'Home' || routes.current.module === 'Auth')
  })

  const routeName = computed(() => {
    return routes.current.name
  })

  const mainCollectionHeader = computed(() => {
    return `${routes.current.module} Query results [${getCollection('main').value.array.length}]`
  })

  return { module, routeName, isLoading, hasSubMenu, mainCollectionHeader }
})

