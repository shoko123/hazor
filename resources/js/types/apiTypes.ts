
import { TModule } from '@/js/types/routesTypes'
import {TFields}from '@/js/types/itemTypes'

type TApiMedia = 
  { full: string, tn: string } | null


type TApiRespShow0 = {
  msg: string,
  fields: TFields[],
  media: TApiMedia[],
  media1: TApiMedia,
  url_id: string,

}

type TApiRespShow1 = {
  id: number,
  url_id: string,
  description: string,
  media: TApiMedia,
}

export { TApiRespShow0, TApiRespShow1, TApiMedia }