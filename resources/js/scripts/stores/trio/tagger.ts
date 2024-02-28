// stores/trio.js
import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import type { TGroupValue, TColumnValueUpdateInfo } from '../../../types/trioTypes'
import type { IObject } from '../../../types/generalTypes'
import type { TFieldsUnion } from '@/js/types/moduleTypes'
import { useXhrStore } from '../xhr'
import { useItemStore } from '../item'
import { useTrioStore } from './trio'
import { useRoutesMainStore } from '../routes/routesMain'

export const useTaggerStore = defineStore('tagger', () => {
  const trio = useTrioStore()
  const { fields, selectedItemParams2 } = storeToRefs(useItemStore())
  
  const selectedNewItemParams = ref<string[]>([])
  const selectedNewItemParams2 = ref<string[]>([])
  function copyCurrentToNew() {
    selectedNewItemParams2.value = [...selectedItemParams2.value]
  }

  function resetNewItemParams() {
    selectedNewItemParams2.value = []
  }

  function parseParamKey(paramKey: string, getParam = true): string {
    //console.log(`parseParamKey() key: ${paramKey} value: ${trio.entities.params[paramKey]}`)
    const pieces = paramKey.split('.')
    return getParam ? trio.trio.entities.params[paramKey].name : pieces[0]

  }

  async function sync() {
    const { send } = useXhrStore()

    const { current } = storeToRefs(useRoutesMainStore())
    console.log(`trio.sync()`)
     return { success: true} 
    const globalTagIds = <number[]>([])
    const modelTagIds = <number[]>([])
    const columns = <TColumnValueUpdateInfo[]>([])

    selectedNewItemParams2.value.forEach(paramKey => {
      const group = trio.trio.entities.groups[parseParamKey(paramKey, false)]

      switch (group.group_type_code) {
        case "TG":
          globalTagIds.push(trio.trio.entities.params[paramKey].id)
          break
        case "TM":
          modelTagIds.push(trio.trio.entities.params[paramKey].id)
          break
        case "CL":
        case "CV": {
          const param = trio.trio.entities.params[paramKey]
          const column_name = (<TGroupValue>group).column_name
          columns.push({ column_name, val: group.group_type_code === "CL" ? param.id : param.name })
        }
          break
      }
    })

    const res = await send<boolean>('tags/sync', 'post', {
      model: current.value.module,
      id: (<TFieldsUnion>fields.value).id,
      ids: globalTagIds,
      model_tag_ids: modelTagIds,
      columns
    })

    if(res.success){
      selectedItemParams2.value = [...selectedNewItemParams2.value]
      const fieldsAsAnObject = fields.value as unknown as IObject
      columns.forEach(x => {
        fieldsAsAnObject[x.column_name] = x.val
      })  
      return { success: true}   
    }
    return { success: false, message: res.message}
  }

  //When clearing params, set columns lookup and value to default (index 0)
  function clearSelectedNewItemParams() {
    selectedNewItemParams2.value = []
    selectedItemParams2.value.forEach(x => {
      const pieces = x.split('.')
      if (['CL', 'CV'].includes(trio.trio.entities.groups[pieces[0]].group_type_code)) {
        selectedNewItemParams2.value.push(trio.trio.entities.groups[pieces[0]].params[0])
      }
    })
  }

  return {
    selectedNewItemParams,
    selectedNewItemParams2,
    clearSelectedNewItemParams,
    resetNewItemParams,
    copyCurrentToNew,
    sync
  }
})