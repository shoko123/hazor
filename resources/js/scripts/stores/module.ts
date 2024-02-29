// stores/module.ts
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import type { TModule } from '../../types/moduleTypes'
import { useMediaStore } from './media'
import { useRoutesMainStore } from './routes/routesMain'
import { useLocusStore } from './modules/locus'
import { useStoneStore } from './modules/stone'
import { useFaunaStore } from './modules/fauna'

export const useModuleStore = defineStore('module', () => {
  const { bucketUrl } = storeToRefs(useMediaStore())
  const { current } = storeToRefs(useRoutesMainStore())
  const counts = ref({ items: 0, media: 0 })
  const welcomeText = ref<string>('')

  const backgroundImage = computed(() => {
    switch (current.value.name) {
      case 'welcome':
        return {
          fullUrl: `${bucketUrl.value}app/background/${current.value.module}.jpg`,
          tnUrl: `${bucketUrl.value}app/background/${current.value.module}-tn.jpg`,
        }
      case 'login':
      case 'register':
      case 'forgot-password':
      case 'reset-password':
        return {
          fullUrl: `${bucketUrl.value}app/background/Auth.jpg`,
          tnUrl: `${bucketUrl.value}app/background/Auth-tn.jpg`,
        }
      default:
        return undefined
    }
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
      default:
        return useFaunaStore()
    }
  }
  const getCurrentModuleStore = computed(() => {
    return getStore(<TModule>current.value.module)
  })

  return { counts, backgroundImage, welcomeText, getCurrentModuleStore, tagFromSlug }
})
