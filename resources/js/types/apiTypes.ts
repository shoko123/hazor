
import { TMedia } from '@/js/types/mediaTypes'
import { TFields } from '@/js/types/itemTypes'
import { TModule } from '@/js/types/routesTypes'
type TItemPerPagePerView = { Image: number, Chip: number, Table: number }

type TApiMedia = { full: string, tn: string, id: number, description: string }

//array types
type TApiArrayMain = { id: number, url_id: string }
type TApiArrayMedia = TApiMedia | null
type TApiArrayRelated = { module: TModule, id: number, url_id: string }

type TApiArray = TApiArrayMain | TApiArrayMedia | TApiArrayRelated

//page types (divided into ApiPageX and PageX groups)

//Api page types
type TApiPageMainImage = {
  id: number,
  url_id: string,
  description: string,
  media1: TApiMedia
}

type TApiPageMainTable = {
  id: number,
  url_id: string,
  description: string,
}

type TApiPageMedia = TApiMedia
type TApiPage = TApiPageMainImage | TApiPageMainTable | TApiPageMedia | TApiArrayMain

//page types, processed from ApiPage types, saved locally, ready for consumption
type TPageMainImage = {
  id: number,
  url_id: string,
  description: string,
  media1: TApiMedia
}

type TPageMainTable = {
  id: number,
  url_id: string,
  description: string,
}

type TPageMediaImage = {
  media: TMedia,
  tag: string
}
//type TPageMedia = TApiMedia
type TPage = TPageMainImage | TPageMainTable | TPageMediaImage



type TApiRespShow0 = {
  msg: string,
  fields: TFields,
  media: TApiMedia[],
  media1: TApiMedia,
  global_tags: any,
  model_tags: any,
  url_id: string,
}

type TApiRespShow1 = {
  id: number,
  url_id: string,
  description: string,
  media: TApiMedia,
}

export {
  TItemPerPagePerView,
  TApiMedia,
  TApiRespShow0,
  TApiRespShow1,
  TApiArrayMain,
  TApiArrayMedia,
  TApiArrayRelated,
  TApiArray,
  TApiPageMainImage,
  TApiPageMainTable,
  TApiPageMedia,
  TApiPage,
  TPageMainImage,
  TPageMainTable,
  TPageMediaImage,
  TPage
}