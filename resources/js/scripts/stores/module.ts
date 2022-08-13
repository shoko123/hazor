// stores/media.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TModule } from '../../types/routesTypes'
import { TMediaItem } from '../../types/mediaTypes'
import { useMainStore } from './main'
export const useModuleStore = defineStore('module', () => {
  const main = useMainStore()
  let name = ref<TModule>('Home')
  let counts = ref({ items: 0, media: 0 })

  const backgroundImage = computed(() => {
    return name.value !== 'Home' ? {
      fullUrl: `${main.bucketUrl}app/background/${name.value}.jpg`,
      tnUrl: `${main.bucketUrl}app/background/${name.value}-tn.jpg`
    } : null
  })

  

  return { name, counts, backgroundImage }
})