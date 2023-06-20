// stores/module.ts
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { TModule } from '../../types/routesTypes'
import { TFields } from '../../types/moduleFieldsTypes'

import { useMediaStore } from './media'
import { useRoutesMainStore } from './routes/routesMain'
import { useItemStore } from './item'
import { useLocusStore } from './modules/locus'
import { useStoneStore } from './modules/stone'
import { useFaunaStore } from './modules/fauna'

export const useModuleStore = defineStore('module', () => {

  const { bucketUrl } =  storeToRefs(useMediaStore())
  const { current } = storeToRefs(useRoutesMainStore())

  let counts = ref({ items: 0, media: 0 })
  const itemViews = ref<string[]>([])

  const backgroundImage = computed(() => {
    let module = current.value.module
    return module !== 'Home' ? {
      fullUrl: `${bucketUrl.value}app/background/${module}.jpg`,
      tnUrl: `${bucketUrl.value}app/background/${module}-tn.jpg`
    } : undefined
  })

  function tagFromUrlId(module: TModule, urlId: string): string {
    //console.log(`module.tagFromUrlId()`)
    const store = getStore(module)
    return store.tagFromUrlId(urlId)
  }

  function getStore(module: TModule) {
    switch (module) {
      case 'Locus':
        return useLocusStore()

      case 'Stone':
        return useStoneStore()

      case 'Fauna':
        return useFaunaStore()
        
      default:
        return useFaunaStore()
    }
  }


  return { counts, backgroundImage, itemViews, tagFromUrlId }
})