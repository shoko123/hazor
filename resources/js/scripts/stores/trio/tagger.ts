// stores/trio.js
import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import type { IObject } from '../../../types/generalTypes'
import type { TFieldsUnion } from '@/js/types/moduleTypes'
import type { TGroupLocalColumn } from '@/js/types/trioTypes2'
import type { TModule } from '@/js/types/moduleTypes'
import { useXhrStore } from '../xhr'
import { useItemStore } from '../item'
import { useTrioStore2 } from './trio2'
import { useRoutesMainStore } from '../routes/routesMain'

export const useTaggerStore = defineStore('tagger', () => {
  const { trio, groupLabelToKey } = storeToRefs(useTrioStore2())
  const { fields, selectedItemParams2 } = storeToRefs(useItemStore())

  const selectedNewItemParams2 = ref<string[]>([])

  function copyCurrentToNew() {
    selectedNewItemParams2.value = [...selectedItemParams2.value]
  }

  function truncateNewItemParams() {
    selectedNewItemParams2.value = []
  }

   //When clearing params, set columns lookup and value to default (index 0)
   function setDefaultNewItemParams() {
    selectedNewItemParams2.value = []
    let clCvParamKeys = selectedItemParams2.value.filter(x => ['CL', 'CV'].includes(trio.value.groupsObj[trio.value.paramsObj[x].groupKey].code))

    console.log(`tagger.clear('CL', 'CV' groupKeys): ${JSON.stringify(clCvParamKeys, null, 2)}`)
    clCvParamKeys.forEach(x => {
      const group = trio.value.groupsObj[trio.value.paramsObj[x].groupKey]
      selectedNewItemParams2.value.push(group.paramKeys[0])
    })
  }
  
  type TSyncPayload = {
    model: TModule | undefined,
    id: number,
    ids: number[],
    model_tag_ids: number[],
    columns: {
      column_name: string,
      val: number | string
    }[]
  }

  async function sync() {
    const { send } = useXhrStore()
    const { current } = storeToRefs(useRoutesMainStore())

    let payload: TSyncPayload = {
      model: current.value.module,
      id: (<TFieldsUnion>fields.value).id,
      ids: [],
      model_tag_ids: [],
      columns: []
    }

    selectedNewItemParams2.value.forEach(paramKey => {
      const group = <TGroupLocalColumn>trio.value.groupsObj[trio.value.paramsObj[paramKey].groupKey]
      switch (group.code) {
        case "TG":
          payload.ids.push(<number>trio.value.paramsObj[paramKey].extra)
          break

        case "TM":
          payload.model_tag_ids.push(<number>trio.value.paramsObj[paramKey].extra)
          break

        case "CL":
        case "CV": {
          const param = trio.value.paramsObj[paramKey]
          payload.columns.push({ column_name: group.column_name, val: group.code === "CL" ? <number>param.extra : param.text })
        }
          break
      }
    })

    //console.log(`tagger.toSend: ${JSON.stringify(payload, null, 2)}`)
    const res = await send<boolean>('tags/sync', 'post', payload)

    if (res.success) {
      return { success: true }
    }
    return { success: false, message: res.message }
  }

  return {
    selectedNewItemParams2,
    setDefaultNewItemParams,
    truncateNewItemParams,
    copyCurrentToNew,
    sync
  }
})