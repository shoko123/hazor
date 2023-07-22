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
  const { selectedNewItemParams, trio, } = storeToRefs(useTrioStore())
  let { fields, selectedItemParams } = storeToRefs(useItemStore())
  const { flipParam } = useTrioStore()

  function paramNewClicked(sourceName: TrioSourceName, paramKey: string, group: TGroup, selected: string[], isSelected: boolean) {
    console.log(`NewClicked() group_type_code: ${group.group_type_code}, group name: ${group.group_name}, isSelected: ${isSelected}\nall selected: [${selected}]`)
    switch (group.group_type_code) {
      case "TG":
      case "TM":
        if ((<TGroupTag>group).multiple) {
          if (isSelected) {
            flipParam(sourceName, paramKey, selected, false)
          } else {
            flipParam(sourceName, paramKey, selected, true)
          }
        } else {
          if (isSelected) {
            flipParam(sourceName, paramKey, selected, false)
          } else {
            //if there is currently  a  selected one - unselect the currently selected and select the new one.
            //if there isn't, select the new one.
            const currentKey = selected.find(x => { return parseParamKey(x, false) === group.group_name })
            if (currentKey !== undefined) {
              flipParam(sourceName, currentKey, selected, false)
              flipParam(sourceName, paramKey, selected, true)
            } else {
              console.log("No param currently selected - selecting clicked")
              flipParam(sourceName, paramKey, selected, true)
            }
          }
        }
        break

      case "CL":
      case "CV":
        if (isSelected) {
          //do nothing
        } else {
          //unselect the currently selected and select the new one
          const currentKey = selected.find(x => { return parseParamKey(x, false) === group.group_name })
          if (currentKey === undefined) {
            console.log("Error in paramNewClicked - can't find a selected param in current group, wrong group_type_code")
            return
          }
          flipParam(sourceName, currentKey, selected, false)
          flipParam(sourceName, paramKey, selected, true)

        }
        break
      default:
        console.log("Error in paramNewClicked - wrong group_type_code")
    }
  }

  function copyCurrentToNew() {
    selectedNewItemParams.value = [...selectedItemParams.value]
  }

  function parseParamKey(paramKey: string, getParam = true): string {
    //console.log(`parseParamKey() key: ${paramKey} value: ${trio.value.entities.params[paramKey]}`)
    let pieces = paramKey.split('.')
    return getParam ? trio.value.entities.params[paramKey].name : pieces[0]
  }

  async function sync() {
    let { send } = useXhrStore()

    let { current } = storeToRefs(useRoutesMainStore())
    console.log(`trio.sync()`)
    let globalTagIds = <number[]>([])
    let modelTagIds = <number[]>([])
    let columns = <TColumnValueUpdateInfo[]>([])

    selectedNewItemParams.value.forEach(paramKey => {
      let group = trio.value.entities.groups[parseParamKey(paramKey, false)]
      switch (group.group_type_code) {
        case "TG":
          globalTagIds.push(trio.value.entities.params[paramKey].id)
          break
        case "TM":
          modelTagIds.push(trio.value.entities.params[paramKey].id)
          break
        case "CL":
        case "CV":
          let param = trio.value.entities.params[paramKey]
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

  return {
    copyCurrentToNew,
    paramNewClicked,
    sync
  }
})