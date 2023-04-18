// stores/media.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { TLocusFields } from '../../../types/itemTypes'
import { useCollectionsStore } from '../collections/collections'
import { useRoutesMainStore } from '../routes/routesMain'

export const useStoneStore = defineStore('stone', () => {

  const { getRouteInfo } = useRoutesMainStore()
  const { collection } = useCollectionsStore()

  let newItem = ref<TLocusFields>({
    id: 0,
    name: "",
    type: "",
    stratum: "",
    square: "",
    elevation: "",
    cross_ref: "",
  })

  const id = computed(() => {
    return 4
  })

  function tagFromUrlId(url_id: string): string {
    return url_id
  }

  function prepareForUpdate(item: TLocusFields): void {

  }

  function prepareForCreate(): void {

  }

  return {
    newItem,
    tagFromUrlId,
    prepareForCreate,
    prepareForUpdate
  }
})
