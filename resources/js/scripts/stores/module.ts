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

  const { bucketUrl } = storeToRefs(useMediaStore())
  const { current } = storeToRefs(useRoutesMainStore())

  let counts = ref({ items: 0, media: 0 })
  const itemViews = ref<string[]>([])

  const backgroundImage = computed(() => {
    let module = current.value.module
    return ['welcome', 'login'].includes(current.value.name) ? {
      fullUrl: `${bucketUrl.value}app/background/${module}.jpg`,
      tnUrl: `${bucketUrl.value}app/background/${module}-tn.jpg`
    } : undefined
  })

  function tagFromSlug(module: TModule, slug: string): string {
    //console.log(`module.tagFromSlug()`)
    const store = getStore(module)
    return store.tagFromSlug(slug)
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
  const getCurrentStore = computed(() => {
    return getStore(current.value.module)
  })
  


  return { counts, backgroundImage, itemViews, getCurrentStore, tagFromSlug }
})