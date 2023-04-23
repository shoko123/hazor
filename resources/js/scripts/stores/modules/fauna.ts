// stores/media.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { TFaunaFields } from '@/js/types/moduleFieldsTypes'
import { useCollectionsStore } from '../collections/collections'
import { useRoutesMainStore } from '../routes/routesMain'

export const useFaunaStore = defineStore('fauna', () => {

  const { getRouteInfo } = useRoutesMainStore()
  const { collection } = useCollectionsStore()

  // let newItem = ref<TFaunaFields>({
  //   id: 0,
  // })


  const id = computed(() => {
    return 4
  })

  function tagFromUrlId(url_id: string): string {
    return url_id
  }

  function prepareForUpdate(item: TFaunaFields): void {

  }

  function prepareForCreate(): void {

  }

  return {
    tagFromUrlId,
    prepareForCreate,
    prepareForUpdate
  }
})
