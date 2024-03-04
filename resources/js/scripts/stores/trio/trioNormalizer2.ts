// stores/trio.jsTApiGroupTag
import { defineStore, storeToRefs } from 'pinia'
import { useMediaStore } from '../media'
import { TGroupLocalColumn } from '@/js/types/trioTypes'

type TApiParamName = {
  name: string
}

type TApiParamNameAndId = TApiParamName & {
  id: number
}

type TApiParamNameAndColumn = TApiParamName & {
  column_name: string
}

type TApiParamUnion =
  | TApiParamName[]
  | TApiParamNameAndId[]
  | TApiParamNameAndColumn
  | string[]
  | null

type TApiGroupBase<T> = {
  group_type_code: TCodeUnion
  group_name: string
  params: T
}

type TApiGroupColumn<T> = TApiGroupBase<T> & {
  column_name: string
  dependency: null | string[]
}

type TApiGroupTag<T> = TApiGroupBase<T> & {
  group_id: number
  dependency: null | string[]
  multiple: boolean
}

type TApiGroupUnion<T> = TApiGroupBase<T> | TApiGroupColumn<T> | TApiGroupTag<T>

type TApiTrio = { name: string; groups: TApiGroupUnion<TApiParamUnion>[] }[]
//////////// Front-end types /////////////////

type TParamTmp = {
  text: string
  extra: null | number | string
}
type TParam = TParamTmp & {
  groupKey: string
}

type TGroupBaseTmp = {
  label: string
  code: TCodeUnion
}

type TGroupTagTmp = TGroupBaseTmp & {
  dependency: string[]
  multiple: boolean
  group_id: number
}
type TGroupColumnTmp = TGroupBaseTmp & {
  column_name: string
  dependency: string[]
}

type TGroupTmpUnion = TGroupBaseTmp | TGroupTagTmp | TGroupColumnTmp

type TGroupBase = TGroupBaseTmp & {
  categoryIndex: number
  paramKeys: string[]
}

type TGroupTag = TGroupBase & {
  dependency: string[]
  multiple: boolean
  group_id: number
}

type TGroupColumn = TGroupBase & {
  column_name: string
  dependency: string[]
}

type TGroupUnion = TGroupBase | TGroupTag | TGroupColumn
type TAllGroups = {
  CV: { apiGroup: TApiGroupColumn<TApiParamName[]>; group: TGroupColumn }
  CR: { apiGroup: TApiGroupColumn<TApiParamName[]>; group: TGroupColumn }
  CB: { apiGroup: TApiGroupColumn<TApiParamName[]>; group: TGroupColumn }
  CL: {
    apiGroup: TApiGroupColumn<TApiParamNameAndId[]>

    group: TGroupColumn
  }
  CS: { apiGroup: TApiGroupColumn<null>; group: TGroupColumn }
  TM: {
    apiGroup: TApiGroupTag<TApiParamNameAndId[]>

    group: TGroupTag
  }
  TG: {
    apiGroup: TApiGroupTag<TApiParamNameAndId[]>

    group: TGroupTag
  }
  MD: { apiGroup: TApiGroupBase<null>; group: TGroupBase }
  OB: {
    apiGroup: TApiGroupBase<TApiParamNameAndColumn[]>

    group: TGroupColumn
  }
}

type AddCode<T, V> = T & { code: V }
//type AddGroupTypeCode<T, V> = T & { group_type_code: V }

type GroupUnionA<T extends object> = {
  [k in keyof T]: T[k] & { group_type_code: k } //{ type: k; payload: T[k] }
}[keyof T]

type GroupUnionB = GroupUnionA<TAllGroups>
type TCodeUnion = keyof TAllGroups
//type GroupApiUnion = AddGroupTypeCode<GroupUnionB['apiGroup'], GroupUnionB['group_type_code']>
type GroupUnion = AddCode<GroupUnionB['group'], GroupUnionB['group_type_code']>
type TAllByCode<Code extends TCodeUnion> = TAllGroups[Code]
type TApiGroupByCode<Code extends TCodeUnion> = TAllByCode<Code>['apiGroup']
// type TGroupByCode<Code extends TCodeUnion> = TAllByCode<Code>['group']
type TParamObj = { [key: string]: TParam }
type TGroupObj = { [key: string]: GroupUnion }
type TCategoriesArray = { name: string; groupKeys: string[] }[]
type TGroupLabelToKey = { [key: string]: string }

export const useTrioNormalizerStore2 = defineStore('trioNormalize2', () => {
  const { mediaCollectionNames } = storeToRefs(useMediaStore())

  let categories: TCategoriesArray = []
  let groupsObj: TGroupObj = {}
  let paramsObj: TParamObj = {}
  let groupLabelToKey: TGroupLabelToKey = {}
  let fieldNameToGroupKey: TGroupLabelToKey = {}
  let orderByOptions: TApiParamNameAndColumn[] = []
  let catCnt = 0
  let grpCnt = 0
  let prmCnt = 0
  let tmpGroup: TGroupTmpUnion | null = null
  let tmpParams: TParamTmp[] = []

  function reset() {
    categories = []
    groupsObj = {}
    paramsObj = {}
    groupLabelToKey = {}
    fieldNameToGroupKey = {}
    catCnt = 0
    grpCnt = 0
    prmCnt = 0
    tmpGroup = null
    tmpParams = []
  }

  function normalizeTrio2(apiTrio: TApiTrio) {
    reset()

    apiTrio.forEach((cat) => {
      categories.push({ name: cat.name, groupKeys: [] })
      cat.groups.forEach((grp) => {
        const grpKey = pad(grpCnt, 3)
        categories[catCnt].groupKeys.push(grpKey)
        switch (grp.group_type_code) {
          case 'CL':
            handleCL(grp as TApiGroupByCode<'CL'>)
            break
          case 'CV':
            handleCV(grp as TApiGroupByCode<'CV'>)
            break
          case 'CB':
            handleCB(grp as TApiGroupByCode<'CB'>)
            break
          case 'CR':
            handleCR(grp as TApiGroupByCode<'CR'>)
            break
          case 'CS':
            handleCS(grp as TApiGroupByCode<'CS'>)
            break
          case 'TM':
            handleTM(grp as TApiGroupByCode<'TM'>)
            break
          case 'TG':
            handleTG(grp as TApiGroupByCode<'TG'>)
            break
          case 'MD':
            handleMD(grp as TApiGroupByCode<'MD'>)
            break
          case 'OB':
            handleOB(grp as TApiGroupByCode<'OB'>)
            break
          default:
        }
        saveGroupAndParams(grpKey)
        grpCnt++
      })
      catCnt++
    })

    return {
      trio: { categories, groupsObj, paramsObj },
      groupLabelToKey,
      fieldNameToGroupKey,
      orderByOptions,
    }
  }

  function saveGroupAndParams(grpKey: string) {
    console.log(
      `saveGroup() group: ${JSON.stringify(tmpGroup, null, 2)} params: ${JSON.stringify(tmpParams, null, 2)}`,
    )
    const grpToSave: TGroupUnion = {
      ...(tmpGroup as TGroupTmpUnion),
      paramKeys: <string[]>[],
      categoryIndex: 0,
    }

    tmpParams.forEach((p) => {
      const prmKey = pad(prmCnt, 3)
      grpToSave.paramKeys.push(prmKey)
      paramsObj[prmKey] = { text: p.text, extra: p.extra, groupKey: pad(grpCnt, 3) }
      prmCnt++
    })
    groupsObj[grpKey] = grpToSave
    groupLabelToKey[grpToSave.label] = grpKey

    if (['CL', 'CV', 'CR', 'CB'].includes(grpToSave.code)) {
      fieldNameToGroupKey[(<TGroupLocalColumn>grpToSave).column_name] = grpKey
    }
  }

  function processDependency(dependency: string[]) {
    //console.log(`processDep() groupLabelToKey: ${JSON.stringify(groupLabelToKey, null, 2)}`);
    return dependency.map((x) => {
      const pieces = x.split('.')
      const group = groupsObj[groupLabelToKey[pieces[0]]]
      //console.log(`groupLabel: ${pieces[0]}. key: ${groupLabelToKey[pieces[0]]}  `);
      const res = group.paramKeys.find((x) => paramsObj[x].text === pieces[1])
      return res!
    })
  }

  function handleCL(grp: TApiGroupByCode<'CL'>) {
    tmpParams = grp.params.map((x) => {
      return { text: x.name, extra: x.id }
    })
    tmpGroup = {
      code: grp.group_type_code,
      label: grp.group_name,
      column_name: grp.column_name,
      dependency: grp.dependency === null ? [] : processDependency(<string[]>grp.dependency),
    }
  }

  function handleCV(grp: TApiGroupByCode<'CV'>) {
    tmpParams = grp.params.map((x) => {
      return { text: x.name, extra: null }
    })
    tmpGroup = {
      label: grp.group_name,
      code: grp.group_type_code,
      column_name: grp.column_name,
    }
  }

  function handleCB(grp: TApiGroupByCode<'CB'>) {
    tmpParams = grp.params.map((x, index) => {
      return { text: x.name, extra: index === 0 ? 1 : 0 }
    })
    tmpGroup = {
      label: grp.group_name,
      code: grp.group_type_code,
      column_name: grp.column_name,
    }
  }

  function handleCR(grp: TApiGroupByCode<'CR'>) {
    tmpParams = grp.params.map((x) => {
      return { text: x.name, extra: null }
    })
    tmpGroup = {
      label: grp.group_name,
      code: grp.group_type_code,
      column_name: grp.column_name,
    }
  }

  function handleCS(grp: TApiGroupByCode<'CS'>) {
    tmpParams = Array(6).fill({ text: '', extra: null })
    tmpGroup = {
      label: grp.group_name,
      code: grp.group_type_code,
      column_name: grp.column_name,
    }
  }

  function handleTG(grp: TApiGroupByCode<'TG'>) {
    tmpParams = grp.params.map((x) => {
      return { text: x.name, extra: x.id }
    })

    tmpGroup = {
      label: grp.group_name,
      code: grp.group_type_code,
      dependency: grp.dependency === null ? [] : processDependency(<string[]>grp.dependency),
      multiple: grp.multiple,
      group_id: grp.group_id,
    }
  }

  function handleTM(grp: TApiGroupByCode<'TM'>) {
    tmpParams = grp.params.map((x) => {
      return { text: x.name, extra: x.id }
    })

    tmpGroup = {
      label: grp.group_name,
      code: grp.group_type_code,
      dependency: grp.dependency === null ? [] : processDependency(<string[]>grp.dependency),
      multiple: grp.multiple,
      group_id: grp.group_id,
    }
  }

  function handleMD(grp: TApiGroupByCode<'MD'>) {
    tmpParams = mediaCollectionNames.value.map((x) => {
      return { text: x, extra: null }
    })
    tmpGroup = {
      label: grp.group_name,
      code: grp.group_type_code,
    }
  }

  function handleOB(grp: TApiGroupByCode<'OB'>) {
    orderByOptions = grp.params
    tmpParams = Array(grp.params.length).fill({ text: '', extra: null })
    tmpGroup = {
      label: grp.group_name,
      code: grp.group_type_code,
    }
  }

  function pad(num: number, size: number): string {
    let s = num + ''
    while (s.length < size) s = '0' + s
    return s
  }

  return {
    normalizeTrio2,
  }
})
