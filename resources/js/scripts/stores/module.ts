// stores/module.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TModule } from '../../types/routesTypes'
import { useMediaStore } from './media'
import { useRoutesMainStore } from './routes/routesMain'
import { useLocusStore } from './modules/locus'
import { useStoneStore } from './modules/stone'
import { useFaunaStore } from './modules/fauna'

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

  function tagFromUrlId(module: TModule, urlId: string): string {
    let store
    switch (module) {
      case 'Locus':
        store = useLocusStore()
        break

      case 'Stone':
        store = useStoneStore()
        break

      case 'Fauna':
        store = useFaunaStore()
        break

      default:
        return "Error in tagFromUrlId"

    }
    return store.tagFromUrlId(urlId)
  }

  return { counts, backgroundImage, itemViews, tagFromUrlId }
})