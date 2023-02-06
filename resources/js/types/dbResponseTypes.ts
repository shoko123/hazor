
import { TModule } from '@/js/types/routesTypes'

type TDbPrimaryMedia = 
  { full: string, tn: string } | null


type TDbShow0 = {
  carouselHeader: string,
  itemIndexB1: number,
  itemTag: string,
  itemDescription: string,
  itemUrlId: string,
  itemModule: TModule,
  media: TDbPrimaryMedia,
}

type TDbShow1 = {
  id: number,
  url_id: string,
  description: string,
  media: TDbPrimaryMedia,
}

export { TDbShow0, TDbShow1, TDbPrimaryMedia }