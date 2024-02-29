// trioTypes.ts

type TApiParamName = {
  name: string
}
type TApiParamNameAndId = TApiParamName & {
  id: number
}
type TApiParamNameAndColumn = TApiParamName & {
  column_name: string
}
type TApiParamNameAndBool = TApiParamName & {
  bool_names: [string, string]
}

type TApiParamUnion =
  | string
  | TApiParamName
  | TApiParamNameAndId
  | TApiParamNameAndColumn
  | TApiParamNameAndBool
  | null

type TApiGroupBasic = {
  group_type_code: TTrioCodeUnion
  group_name: string
  params: TApiParamUnion[]
}
type TApiGroupColumn = TApiGroupBasic & {
  column_name: string
  dependency: null | string[]
}

type TApiGroupTag = TApiGroupBasic & {
  group_id: number
  dependency: null | string[]
  multiple: boolean
}

type TApiGroupOrderBy = TApiGroupBasic & {
  options: TApiParamNameAndColumn[]
}

type TApiGroupUnion = TApiGroupBasic | TApiGroupColumn | TApiGroupTag | TApiGroupOrderBy

//////////// Front-end types /////////////////

type TrioSourceName = 'Item' | 'New' | 'Filter'

type TParam = {
  text: string
  extra: null | number | string
}
type TParamLocal = TParam & {
  groupKey: string
}

type TGroupBase = { label: string; code: TTrioCodeUnion; params: TParam[] }

type TGroupTag = TGroupBase & {
  dependency: string[]
  multiple: boolean
  group_id: number
}

type TGroupColumn = TGroupBase & {
  column_name: string
  dependency: string[]
}
type TGroupUnion = TGroupBase | TGroupColumn | TGroupTag

type TGroupLocalBase = Omit<TGroupBase, 'params'> & {
  paramKeys: string[]
  categoryIndex: number
}
type TGroupLocalColumn = Omit<TGroupColumn, 'params'> & {
  paramKeys: string[]
  categoryIndex: number
}
type TGroupLocalTag = Omit<TGroupTag, 'params'> & {
  paramKeys: string[]
  categoryIndex: number
}
type TGroupLocalUnion = TGroupLocalBase | TGroupLocalColumn | TGroupLocalTag
////////////
type TTrioAll =
  | {
      code: 'TM'
      apiGroup: TApiGroupTag
      apiParam: TApiParamNameAndId
      group: TGroupTag
    }
  | {
      code: 'TG'
      apiGroup: TApiGroupTag
      apiParam: TApiParamNameAndId
      group: TGroupTag
    }
  | {
      code: 'CL'
      apiGroup: TApiGroupColumn
      apiParam: TApiParamNameAndId
      group: TGroupColumn
    }
  | {
      code: 'CV'
      apiGroup: TApiGroupTag
      apiParam: string
      group: TGroupColumn
    }
  | {
      code: 'CR'
      apiGroup: TApiGroupTag
      apiParam: string
      group: TGroupColumn
    }
  | {
      code: 'CB'
      apiGroup: TApiGroupBasic
      apiParam: TApiParamNameAndBool
      group: TGroupColumn
    }
  | {
      code: 'CS'
      apiGroup: TApiGroupColumn
      apiParam: null
      group: TGroupColumn
    }
  | {
      code: 'MD'
      apiGroup: TApiGroupColumn
      apiParam: TApiParamNameAndId
      group: TGroupColumn
    }
  | {
      code: 'MD'
      apiGroup: TApiGroupColumn
      apiParam: TApiParamNameAndId
      group: TGroupColumn
    }
  | {
      code: 'OB'
      apiGroup: TApiGroupColumn
      apiParam: TApiParamNameAndId
      group: TGroupBase
    }

type TTrioCodeUnion = TTrioAll['code']
type TTrioApiGroupUnion = TTrioAll['apiGroup']
type TTrioGroupUnion = TTrioAll['group']
type TTrioAllGeneric<TM extends TTrioCodeUnion> = Extract<TTrioAll, { code: TM }>

type TParamObj = { [key: string]: TParamLocal }
type TGroupObj = { [key: string]: TGroupLocalUnion }
type TCategoriesArray = { name: string; groupKeys: string[] }[]
type TGroupLabelToKey = { [key: string]: string }
type TTrio = { categories: TCategoriesArray; groupsObj: TGroupObj; paramsObj: TParamObj }

//type TApiGroup = { group_name: string, group_type_code: TTrioCodeUnion, params: TApiParamUnion[] }
type TApiTrio = { name: string; groups: TApiGroupUnion[] }[]

export {
  TApiParamNameAndId,
  TApiParamName,
  TApiParamNameAndBool,
  TApiGroupBasic,
  TApiGroupColumn,
  TApiGroupTag,
  TApiGroupUnion,
  TApiGroupOrderBy,
  TTrioApiGroupUnion,
  TTrioCodeUnion,
  TTrioAll,
  TApiTrio,
  TApiParamNameAndColumn,
  TTrioAllGeneric,
  TTrioGroupUnion,
  TGroupBase,
  TGroupTag,
  TGroupColumn,
  TGroupLocalBase,
  TGroupLocalColumn,
  TGroupLocalTag,
  TParam,
  TParamLocal,
  TGroupUnion,
  TGroupLocalUnion,
  TTrio,
  TParamObj,
  TGroupObj,
  TCategoriesArray,
  TGroupLabelToKey,
  TrioSourceName,
}
