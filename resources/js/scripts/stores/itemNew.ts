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
  const { send } = useXhrStore()
  const router = useRouter()
 const { showSnackbar} = useNotificationsStore()
  const random = ref<number>(0)

  const id = computed(() => {
    return 5
  })

  async function upload(item: object) {
    let id = item.id
    let toSend = {...item}
    delete toSend.id
    await send('model/store', 'put', { model: current.value.module, item: toSend, id})
    .then(res => {
        console.log(`model.store() returned (success) ${JSON.stringify(res.data, null, 2)}`)
        showSnackbar(`${current.value.module} sred successfully`)        
    })
    .catch(err => {
        showSnackbar(`model.store failed`)
        console.log(`model.store  failed. err: ${JSON.stringify(err, null, 2)}`)
        return false
    })
    .finally(() => {
        console.log(`model.store - finally`)
        return true
    })    
    //xhr
    //router.go(-1)
  }



  return {
    upload
  }
})
