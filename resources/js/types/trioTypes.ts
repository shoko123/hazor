// trioTypes.ts
interface IObject {
    [key: string]: any
  }
  
  type TCategory = {
    name: string,
    groups: string[]
  }
  
  type TGroupValue = {
    group_type_code: string,
    group_name: string,
    table_name: string,
    column_name: string,
    params: string[]
  }
  
  type TGroupTag = {
    group_type_code: string,
    group_name: string,
    group_id: string,
    multiple: string,
    dependency: string[],
    params: string[]
  }
  
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
  
  
  
  type TSelectedParam = {
    key: string,
    groupKey: string,
    groupTypeCode: string
  }
export { IObject, TCategory, TGroupValue, TGroupTag, IGroupObject, ICategoryObject, TEntities, Trio, TSelectedParam }