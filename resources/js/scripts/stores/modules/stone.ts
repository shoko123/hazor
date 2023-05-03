// stores/media.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { TStoneFields } from '@/js/types/moduleFieldsTypes'
import { useCollectionsStore } from '../collections/collections'
import { useRoutesMainStore } from '../routes/routesMain'

export const useStoneStore = defineStore('stone', () => {

  const { getRouteInfo } = useRoutesMainStore()
  const { collection } = useCollectionsStore()

  let ns = ref<TStoneFields>({
    id: 0,
    material_id: 1,
    base_type_id: 1,
    type: "",
    area: "XX",
    date: "",
    basket: "",
    locus: "",
    prov_notes: "",
    material: "",
    dimensions: "",
    details: ""
  })
  type TField = keyof TStoneFields

  const getNewItem = computed(() => {
    return ns.value
  })

  function tagFromUrlId(url_id: string): string {
    return url_id
  }

  function upload(fields: object) {
    console.log(`stone.upload() fields:  ${JSON.stringify(fields, null, 2)}`)

  }

  function prepareForUpdate(current: TStoneFields): void {
    console.log(`stone.prepareForUpdate:  ${JSON.stringify(current, null, 2)}`)
    ns.value = { ...current }
  }

  function prepareForCreate(): void {

  }

  return {
    ns,
    upload,
    tagFromUrlId,
    prepareForCreate,
    prepareForUpdate
  }
})
