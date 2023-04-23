// stores/media.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { TStoneFields } from '@/js/types/moduleFieldsTypes'
import { useCollectionsStore } from '../collections/collections'
import { useRoutesMainStore } from '../routes/routesMain'

export const useStoneStore = defineStore('stone', () => {

  const { getRouteInfo } = useRoutesMainStore()
  const { collection } = useCollectionsStore()

  // let newItem = ref<TStoneFields>({
  //   id: 0,
  // })

  const id = computed(() => {
    return 4
  })

  function tagFromUrlId(url_id: string): string {
    return url_id
  }

  function prepareForUpdate(item: TStoneFields): void {

  }

  function prepareForCreate(): void {

  }

  return {
    //newItem,
    tagFromUrlId,
    prepareForCreate,
    prepareForUpdate
  }
})
