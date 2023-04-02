
import { TMedia } from '@/js/types/mediaTypes'
import { TFields } from '@/js/types/itemTypes'

type TItemPerPagePerView = { Image: number, Chip: number, Table: number }

type TApiMedia = { full: string, tn: string } | null

type TApiArrayItemMain = { id: number, url_id: string }
type TApiArrayItemMedia = { media: TApiMedia, description: string }
type TApiArrayItemOne = { id: number, url_id: string }

type TApiMainImage = {
  id: number,
  url_id: string,
  description: string,
  media1: TApiMedia
}

type TApiMainTable = {
  id: number,
  url_id: string,
  description: string,
}

type TApiPageItem = TApiMainImage | TApiMainTable | TApiMedia | TApiArrayItemMain

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

export { TItemPerPagePerView, TApiRespShow0, TApiRespShow1, TApiMedia, TApiMainImage, TApiMainTable, TApiPageItem, TApiArrayItemMain }