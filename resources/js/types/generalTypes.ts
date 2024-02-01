// generalTypes.ts
interface IObject {
  [key: string]: any
}

interface IStringObject {
  [key: string]: string
}

type TXhrMethod = "get" | "put" | "post" | "delete"
type TXhrResult<T> = { success: true, data: T, message: string, status: number } |  { success: false, message: string | undefined, status: number } 
type TXhrEmptyResult = { success: boolean, message: string | undefined, status: number }

export {
  TXhrMethod,
  TXhrResult,
  TXhrEmptyResult,
  IObject,
  IStringObject
}