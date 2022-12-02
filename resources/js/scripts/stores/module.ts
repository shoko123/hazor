// stores/module.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useMediaStore } from './media'
import { useRoutesMainStore } from './routes/routesMain'




export const useModuleStore = defineStore('module', () => {
  const { getBucketUrl } = useMediaStore()
  const rms = useRoutesMainStore()

  let counts = ref({ items: 0, media: 0 })
  const itemViews = ref<string[]>([])

  const backgroundImage = computed(() => {
    let bucketUrl = getBucketUrl()
    let module = rms.getModule()
    return module !== 'Home' ? {
      fullUrl: `${bucketUrl}app/background/${module}.jpg`,
      tnUrl: `${bucketUrl}app/background/${module}-tn.jpg`
    } : undefined
  })

  return { counts, backgroundImage, itemViews }
})