// app.js
//Stores data common to the whole app:
//accessibility, bucketUrl, carousel, 
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useMainStore } from './main'
import { useModuleStore } from './module'
import { useRoutesStore } from './routes/routesMain'

export const useStatusStore = defineStore('status', () => {

  let routes = useRoutesStore()
  let main = useRoutesStore()
  //let m = useModuleStore()

  const isLoading = computed(() => {
    return routes.isLoading
  })

  const module = computed(() => {
    return { name: routes.current.module }
  })
  const subMenu = computed(() => {

    return routes.current.module

  })

  const auth = computed(() => {
    return true
  })

  return { module, auth, isLoading, subMenu }
})

