type TrioSourceName = 'Item' | 'New' | 'Filter'

type TAllGroups = {
  CV: {
    apiGroup: TApiGroupColumn<TApiParamName[]>
    group: TGroupColumn
  }
  CR: {
    apiGroup: TApiGroupColumn<TApiParamName[]>
    group: TGroupColumn
  }
  CB: {
    apiGroup: TApiGroupColumn<TApiParamName[]>
    group: TGroupColumn
  }
  CL: {
    apiGroup: TApiGroupColumn<TApiParamNameAndId[]>
    group: TGroupColumn
  }
  CS: {
    apiGroup: TApiGroupColumn<null>
    group: TGroupColumn
  }
  TM: {
    apiGroup: TApiGroupTag<TApiParamNameAndId[]>
    group: TGroupTag
  }
  TG: {
    apiGroup: TApiGroupTag<TApiParamNameAndId[]>
    group: TGroupTag
  }
  MD: {
    apiGroup: TApiGroupBase<null>
    group: TGroupBase
  }
  OB: {
    apiGroup: TApiGroupBase<TApiParamNameAndColumn[]>
    group: TGroupColumn
  }
}

//////////// Backend types /////////////////

type TApiParamName = { name: string }

type TApiParamNameAndId = TApiParamName & { id: number }

type TApiParamNameAndColumn = TApiParamName & { column_name: string }

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

type TApiTrio = { name: string; groups: TGroupApiUnion[] }[]

//////////// Frontend types /////////////////

type TParamTmp = {
  text: string
  extra: null | number | string
}

type TParam = TParamTmp & {
  groupKey: string
}

type AddTrioFields<T> = T & {
  categoryIndex: number
  paramKeys: string[]
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

type TGroupBase = AddTrioFields<TGroupBaseTmp>
type TGroupTag = AddTrioFields<TGroupTagTmp>
type TGroupColumn = AddTrioFields<TGroupColumnTmp>

type AddCode<T, V> = T & { code: V }
type AddGroupTypeCode<T, V> = T & { group_type_code: V }

type GroupUnionA<T extends object> = {
  [k in keyof T]: T[k] & { group_type_code: k }
}[keyof T]

type GroupUnionB = GroupUnionA<TAllGroups>
type TCodeUnion = keyof TAllGroups
type TGroupApiUnion = AddGroupTypeCode<GroupUnionB['apiGroup'], GroupUnionB['group_type_code']>
type TGroupUnion = AddCode<GroupUnionB['group'], GroupUnionB['group_type_code']>

type TAllByCode<Code extends TCodeUnion> = TAllGroups[Code]
type TApiGroupByCode<Code extends TCodeUnion> = TAllByCode<Code>['apiGroup']

type TParamObj = { [key: string]: TParam }
type TGroupObj = { [key: string]: TGroupUnion }
type TCategoriesArray = { name: string; groupKeys: string[] }[]
type TGroupLabelToKey = { [key: string]: string }

type TTrio = { categories: TCategoriesArray; groupsObj: TGroupObj; paramsObj: TParamObj }

export {
  TrioSourceName,
  TTrio,
  TApiTrio,
  TGroupTmpUnion,
  TParamTmp,
  TGroupUnion,
  TApiGroupByCode,
  TParamObj,
  TGroupObj,
  TCategoriesArray,
  TGroupLabelToKey,
  TGroupBase,
  TGroupColumn,
  TGroupTag,
  TApiParamNameAndColumn,
}
