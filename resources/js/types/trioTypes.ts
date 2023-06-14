// trioTypes.ts
import { IObject } from '@/js/types/generalTypes'

type TCategory = {
  name: string,
  groups: string[]
}
type TGroupType = 'TM' | 'TG' | 'LV' | 'CV' | 'CS' | 'BF'

type TGroupValue = {
  group_type_code: TGroupType,
  group_name: string,
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

type TGroup = TGroupTag | TGroupValue

interface IGroupObject {
  [key: string]: TGroupValue | TGroupTag
}
interface ICategoryObject {
  [key: string]: TCategory
}

type TEntities = {
  categories: ICategoryObject,
  groups: IGroupObject,
  params: IObject
}

type Trio = {
  entities: TEntities,
  result: string[],
}

type TParam = {
  id: number,
  name: string,
  ordr: number,
  paramKey: string
}

type TColumnInfo = {
  column_name: string,
  val: number | string
  paramKey: string
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
  TCategory,
  TGroupValue,
  TGroupTag,
  TGroup,
  TGroupType,
  TParam,
  TColumnInfo,
  TColumnSearch,
  IGroupObject,
  ICategoryObject,
  TEntities,
  Trio,
  TSelectedParam,
  TrioSourceName,
  TmpGroup,
}