// stores/media.js
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useMediaStore } from './media'
import { useRoutesMainStore } from './routes/routesMain'




export const useModuleStore = defineStore('module', () => {
  const { bucketUrl } = storeToRefs(useMediaStore())
  const routes = useRoutesMainStore()

  let counts = ref({ items: 0, media: 0 })
  const itemViews = ref<string[]>([])

  const backgroundImage = computed(() => {
    return routes.current.module !== 'Home' ? {
      fullUrl: `${bucketUrl.value}app/background/${routes.current.module}.jpg`,
      tnUrl: `${bucketUrl.value}app/background/${routes.current.module}-tn.jpg`
    } : undefined
  })

  const name = computed(() => {
    return routes.current.module
  })

  return { name, counts, backgroundImage }
})