
import { TModule } from '@/js/types/routesTypes'

type TApiMedia = 
  { full: string, tn: string } | null


type TApiRespShow0 = {
  carouselHeader: string,
  itemIndexB1: number,
  itemTag: string,
  itemDescription: string,
  itemUrlId: string,
  itemModule: TModule,
  media: TApiMedia,
}

type TApiRespShow1 = {
  id: number,
  url_id: string,
  description: string,
  media: TApiMedia,
}

export { TApiRespShow0, TApiRespShow1, TApiMedia }