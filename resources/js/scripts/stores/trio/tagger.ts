// stores/trio.js
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import type { TGroupTag, TGroup, Trio, TrioSourceName, TmpGroup, TGroupValue, TColumnValueUpdateInfo } from '../../../types/trioTypes'
import type { IObject } from '../../../types/generalTypes'
import { useXhrStore } from '../xhr'
import { useItemStore } from '../item'
import { useTrioStore } from './trio'
import { useRoutesMainStore } from '../routes/routesMain'
import { TFields } from '@/js/types/moduleFieldsTypes'


export const useTaggerStore = defineStore('tagger', () => {
  const trio = useTrioStore()
  let { fields, selectedItemParams } = storeToRefs(useItemStore())

  let selectedNewItemParams = ref<string[]>([])

  function copyCurrentToNew() {
    selectedNewItemParams.value = [...selectedItemParams.value]
  }

  function parseParamKey(paramKey: string, getParam = true): string {
    //console.log(`parseParamKey() key: ${paramKey} value: ${trio.entities.params[paramKey]}`)
    let pieces = paramKey.split('.')
    return getParam ? trio.trio.entities.params[paramKey].name : pieces[0]
  }

  async function sync() {
    let { send } = useXhrStore()

    let { current } = storeToRefs(useRoutesMainStore())
    console.log(`trio.sync()`)
    let globalTagIds = <number[]>([])
    let modelTagIds = <number[]>([])
    let columns = <TColumnValueUpdateInfo[]>([])

    selectedNewItemParams.value.forEach(paramKey => {
      let group = trio.trio.entities.groups[parseParamKey(paramKey, false)]
      switch (group.group_type_code) {
        case "TG":
          globalTagIds.push(trio.trio.entities.params[paramKey].id)
          break
        case "TM":
          modelTagIds.push(trio.trio.entities.params[paramKey].id)
          break
        case "CL":
        case "CV":
          let param = trio.trio.entities.params[paramKey]
          let column_name = (<TGroupValue>group).column_name
          columns.push({ column_name, val: group.group_type_code === "CL" ? param.id : param.name })
          break
      }
    })

    let data = {
      model: current.value.module,
      id: (<TFields>fields.value).id,
      ids: globalTagIds,
      model_tag_ids: modelTagIds,
      columns
    }

    console.log(`tags.sync() data: ${JSON.stringify(data, null, 2)}`)

    await send('tags/sync', 'post', data)
      .catch(err => {
        console.log(`tags.sync() failed. err: ${JSON.stringify(err, null, 2)}`)
        throw err
      })

    //once back successfully from server, update locally
    selectedItemParams.value = [...selectedNewItemParams.value]
    let fieldsAsAnObject = fields.value as unknown as IObject
    columns.forEach(x => {
      fieldsAsAnObject[x.column_name] = x.val
    })
  }

  //When clearing params, set columns lookup and value to default (index 0)
  function clearSelectedNewItemParams() {
    selectedNewItemParams.value = []
    selectedItemParams.value.forEach(x => {
      let pieces = x.split('.')
      if (['CL', 'CV'].includes(trio.trio.entities.groups[pieces[0]].group_type_code)) {  
          selectedNewItemParams.value.push(trio.trio.entities.groups[pieces[0]].params[0])     
      }
    })
  }

  return {
    selectedNewItemParams,
    clearSelectedNewItemParams,
    copyCurrentToNew,
    sync
  }
})