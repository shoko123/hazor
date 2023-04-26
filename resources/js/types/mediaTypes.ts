// mediaTypes.ts
import { TCollectionName } from '@/js/types/collectionTypes'
import { TModule } from '@/js/types/routesTypes'

type TMedia = {
        hasMedia: boolean,
        urls: { full: string, tn: string },
}

type TImageableDetailsMain = {
        id: number,
        url_id: string,
        tag: string,
        description: string
}

type TImageableDetailsMedia = {
        id: number,
        description: string | null
}
type TImageableDetails = TImageableDetailsMain | TImageableDetailsMedia

type TApiCarouselMain = {
        id: number,
        url_id: string,
        description: string,
        media: TMedia,
        module: TModule
}

type TApiCarouselMedia = {
        id: number,
        description: string,
        media: TMedia,
        collection_name: string,
        order_column: number,        
}

type TApiCarousel = TApiCarouselMedia | TApiCarouselMain

type TCarousel = {
        carouselHeader: string,
        itemIndexB1: number,
        itemTag: string,
        itemDescription: string,
        itemUrlId: string,
        itemModule: TModule,
        media: TMedia,
      }


export { TMedia, TImageableDetailsMain, TImageableDetailsMedia, TImageableDetails, TCarousel, TApiCarousel, TApiCarouselMedia, TApiCarouselMain }