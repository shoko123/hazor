
import { TMedia } from '@/js/types/mediaTypes'
import { TFields } from '@/js/types/itemTypes'

type TItemPerPagePerView = { Image: number, Chip: number, Table: number }

type TApiMedia = { full: string, tn: string, id?: number, description?: string }
type TApiMediaOrNull = TApiMedia | null

type TApiArrayItemMain = { id: number, url_id: string }
type TApiArrayItemMedia = { media: TApiMediaOrNull, description: string }
type TApiArrayItemOne = { id: number, url_id: string }

type TApiMainImage = {
  id: number,
  url_id: string,
  description: string,
  media1: TApiMediaOrNull
}

type TApiMainTable = {
  id: number,
  url_id: string,
  description: string,
}

type TApiPageItem = TApiMainImage | TApiMainTable | TApiMediaOrNull | TApiArrayItemMain

type TApiRespShow0 = {
  msg: string,
  fields: TFields,
  media: TApiMediaOrNull[],
  media1: TApiMediaOrNull,
  global_tags: any,
  model_tags: any,
  url_id: string,
}

type TApiRespShow1 = {
  id: number,
  url_id: string,
  description: string,
  media: TApiMediaOrNull,
}

export {
  TItemPerPagePerView,
  TApiRespShow0,
  TApiRespShow1,
  TApiMedia,
  TApiMediaOrNull,
  TApiMainImage,
  TApiMainTable,
  TApiPageItem,
  TApiArrayItemMain
}