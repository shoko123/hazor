
import { TMediaItem } from '@/js/types/mediaTypes'
import { TModule } from '@/js/types/routesTypes'

type TDBCarouselItem = {
  carouselHeader: string,
  itemIndexB1: number,
  itemTag: string,
  itemDescription: string,
  itemUrlId: string,
  itemModule: TModule,
  media: TMediaItem,
}
type TCarouselDetails = {
  carouselHeader: string,
  itemIndexB1: number,
  itemTag: string,
  itemDescription: string,
  itemUrlId: string,
  itemModule: TModule,
  media: TMediaItem,
}

export { TCarouselDetails, TDBCarouselItem }