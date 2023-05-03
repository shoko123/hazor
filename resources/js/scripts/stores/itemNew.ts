import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { TItemMandatoryFields } from '@/js/types/moduleFieldsTypes'
import { useCollectionsStore } from './collections/collections'

import { useRoutesMainStore } from './routes/routesMain'
import { useXhrStore } from './xhr'
import { useNotificationsStore } from './notifications'
export const useItemNewStore = defineStore('itemNew', () => {

  const { current } = storeToRefs(useRoutesMainStore())
  const { collection, itemByIndex, itemIndexById, next } = useCollectionsStore()

  const router = useRouter()

  const random = ref<number>(0)

  const id = computed(() => {
    return 5
  })

  function upload() {
    //xhr
    router.go(-1)
  }



  return {
    upload
  }
})
