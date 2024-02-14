// trioTypes.ts
type TApiTrio = {name: string, groups: object[]}[]

type TCategory = {
  id: number,
  name: string,
  groups: string[]
}

type TGroupType = 'TM' | 'TG' | 'CL' | 'CV' | 'CB' | 'CS' | 'CR' | 'BF' | 'OB'

type TGroupOrderByOptionObject = {
  name: string,
  column_name: string
}

type TGroupValue = {
  group_type_code: TGroupType,
  group_name: string,
  dependency: string[],  
  table_name: string,
  column_name: string,
  params: string[],
  categoryKey: string
}

type TGroupTag = {
  group_type_code: TGroupType,
  group_name: string,
  group_id: string,
  multiple: boolean,
  dependency: string[],
  params: string[],
  categoryKey: string
}

type TGroupsWithDependency = TGroupValue | TGroupTag

type TGroupOrderBy = {
  group_type_code: TGroupType,
  group_name: string,
  group_id: number,
  params: string[],
  options: TGroupOrderByOptionObject[],
  categoryKey: string
}

type TGroup = TGroupTag | TGroupValue | TGroupOrderBy 

type TParam = {
  id: number,
  name: string,
  order: number,
  paramKey: string,
  group: string,
  column_name?: string,
  boolVal?: boolean
}

interface ICategoryObject {
  [key: string]: TCategory
}
interface IGroupObject {
  [key: string]: TGroup
}

interface IParamObject {
  [key: string]: TParam
}

type TEntities = {
  categories: ICategoryObject,
  groups: IGroupObject,
  params: IParamObject
}

type Trio = {
  entities: TEntities,
  result: string[],
}



type TColumnValueUpdateInfo = {
  column_name: string,
  val: number | string
}

type TColumnSearch = {
  column_name: string,
  search_term:  string
}

type TSelectedParam = {
  key: string,
  groupKey: string,
  groupTypeCode: string
}

type TrioSourceName = 'Item' | 'New' | 'Filter'
type TmpGroup = { groupName: string, params: string[], categoryKey: string, selectedCount: number }

export {
  TApiTrio,
  TCategory,
  TGroupValue,
  TGroupTag,
  TGroupOrderBy,
  TGroupsWithDependency,
  TGroupOrderByOptionObject,
  TGroup,
  TGroupType,
  TParam,
  TColumnValueUpdateInfo,
  TColumnSearch,
  IGroupObject,
  ICategoryObject,
  TEntities,
  Trio,
  TSelectedParam,
  TrioSourceName,
  TmpGroup,
}