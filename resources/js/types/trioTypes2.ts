// trioTypes2.ts

type TApiParamName = {
  name: string,
}
type TApiParamNameAndId = TApiParamName & {
  id: number
}
type TApiParamNameAndColumn = TApiParamName & {
  column_name: number
}
type TApiParamNameAndBool = TApiParamName & {
  bool_names: [string, string]
}

type TApiParamUnion = string | TApiParamNameAndId | TApiParamName | TApiParamNameAndColumn | TApiParamName | TApiParamNameAndBool | null

type TApiGroupBasic<TCode extends TTrioCodeUnion, TApiParam extends TApiParamUnion> = {
  group_type_code: TCode,
  group_name: string,
  params: TApiParam[],
}
type TApiGroupColumn<TCode extends TTrioCodeUnion, TApiParam extends TApiParamUnion> = TApiGroupBasic<TCode, TApiParam> & {
  column_name: string
}

type TApiGroupTag<TCode extends TTrioCodeUnion, TApiParam extends TApiParamUnion> = TApiGroupBasic<TCode, TApiParam> & {
  dependency: null | string[],
  multiple: boolean,
}

type TApiGroupUnion<TCode extends TTrioCodeUnion> = TApiGroupBasic<TCode, TApiParamUnion> | TApiGroupColumn<TCode, TApiParamUnion> | TApiGroupTag<TCode, TApiParamUnion>

type TGroupTag = {
  group_type_code: 'TG' | 'TM',
  groupLabel: string,
  paramKeys: string[],
  dependency: null | string[],
  multiple: boolean,
  categoryIndex: number,
}

type TGroupColumn = {
  group_type_code: 'CV',
  groupLabel: string,
  columnName: string,
  paramKeys: string[],
  dependency: string[],
  categoryIndex: number,
}

type TParamText = {
  groupKey: string,
  paramLabel: string,
}
type TParamTextAndId = {
  groupKey: string,
  paramLabel: string,
  id: number
}
type TParamOrderBy = {
  groupKey: string,
  paramOrderByLabel: string,
}
type TParamSearch = {
  groupKey: string,
  searchText: string,
}

type TGroupLocalParams = {
  group_type_code: 'MD',
  group_name: string,
  paramKeys: string[],
  categoryIndex: number,
}

type TGroupOrderBy = {
  group_type_code: 'OB',
  group_name: string,
  paramKeys: string[],
  categoryIndex: number,
}

////////////
type TTrioAll = {
  code: 'TG',
  apiGroup: TApiGroupTag<'TG', TApiParamNameAndId>,
  group: TGroupTag,
  params: TParamTextAndId,

} | {
  code: 'TM',
  apiGroup: TApiGroupTag<'TM', TApiParamNameAndId>,
  group: TGroupTag,
  params: TParamTextAndId,
} | {
  code: 'CL',
  apiGroup: TApiGroupTag<'CL', TApiParamNameAndId>,
  group: TGroupColumn,
  params: TParamTextAndId,
} | {
  code: 'CV',
  apiGroup: TApiGroupTag<'CL', string>,
  group: TGroupColumn,
  params: TParamText,
} | {
  code: 'CR',
  apiGroup: TApiGroupTag<'CR', TApiParamName>,
  group: TGroupColumn,
  params: TParamText

} | {
  code: 'CB',
  apiGroup: TApiGroupTag<'CB', TApiParamNameAndBool>,
  group: TGroupColumn,
  params: {
    groupKey: string,
    label: string,
    value: boolean
  }
} | {
  code: 'CS',
  apiGroup: TApiGroupColumn<'CS', null>,
  group: TGroupColumn,
  params: TParamSearch
} | {
  code: 'MD',
  apiGroup: TApiGroupColumn<'CS', null>,
  group: TGroupColumn,
  params: TParamText

} | {
  code: 'BF',
  apiGroup: TApiGroupColumn<'CS', TApiParamNameAndId>,
  group: TGroupColumn,
  params: TParamText

} | {
  code: 'OB',
  apiGroup: TApiGroupColumn<'CS', TApiParamNameAndColumn>,
  group: TGroupOrderBy,
  params: TParamOrderBy
}


type TTrioCodeUnion = TTrioAll['code']
type TTrioApiGroupUnion = TTrioAll['apiGroup']
type TTrioGroupUnion = TTrioAll['group']
type TTrioAllGeneric<TM extends TTrioCodeUnion> = Extract<TTrioAll, { code: TM }>

//type TApiGroup = { group_name: string, group_type_code: TTrioCodeUnion, params: TApiParamUnion[] }
type TApiTrio2 = { name: string, groups: TApiGroupUnion<TTrioCodeUnion>[] }[]

export {
  TApiParamNameAndId,
  TApiGroupColumn,
  TTrioApiGroupUnion,
  TParamSearch,
  TTrioCodeUnion,
  TTrioAll,
  TApiTrio2,
  TTrioAllGeneric,
  TTrioGroupUnion
  //   TCategory,
  //   TGroupValue,
  //   TGroupTag,
  //   TGroupOrderBy,
  //   TGroupsWithDependency,
  //   TGroupOrderByOptionObject,
  //   TGroup,
  //   TTrioCode,
  //   TParam,
  //   TColumnValueUpdateInfo,
  //   TColumnSearch,
  //   IGroupObject,
  //   ICategoryObject,
  //   TEntities,
  //   Trio,
  //   TSelectedParam,
  //   TrioSourceName,
  //   TmpGroup,
}