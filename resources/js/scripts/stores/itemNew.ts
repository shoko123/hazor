import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { TFieldsToStore } from '@/js/types/moduleFieldsTypes'
import { useCollectionsStore } from './collections/collections'
import { useRoutesMainStore } from './routes/routesMain'
import { useXhrStore } from './xhr'
import { useNotificationsStore } from './notifications'
export const useItemNewStore = defineStore('itemNew', () => {

  const { current } = storeToRefs(useRoutesMainStore())
  const { collection, itemByIndex, itemIndexById, next } = useCollectionsStore()
  const { send } = useXhrStore()
  const router = useRouter()
  const { showSnackbar } = useNotificationsStore()
  const random = ref<number>(0)

  const id = computed(() => {
    return 5
  })

  async function upload(isCreate: boolean, fields: TFieldsToStore, id?: number) {
    let res = await send('model/store', isCreate ? 'post' : 'put', { model: current.value.module, item: fields, id })
      .catch(err => {
        showSnackbar(`model.store failed! Please try later!`)
        console.log(`model.store  failed. err: ${JSON.stringify(err, null, 2)}`)
        throw err
      })

    console.log(`model.store() returned (success) ${JSON.stringify(res.data, null, 2)}`)
    showSnackbar(`${current.value.module} updated successfully`)
    return res.data.item
  }

  return {
    upload
  }
})
