// mediaTypes.ts
import { TCollectionName } from '@/js/types/collectionTypes'
import { TModule } from '@/js/types/routesTypes'

type TMedia = {
        hasMedia: boolean,
        urls: { full: string, tn: string },
        id: number,
        description: string
}

type TMediaDetailsMain = {
        id: number,
        url_id: string,
        tag: string,
        description: string
}

type TMediaDetailsMedia = {
        id: number,
        collection_name: string,
        order_column: number,
        description: string | null
}

type TCarousel = {
        carouselHeader: string,
        itemIndexB1: number,
        itemTag: string,
        itemDescription: string,
        itemUrlId: string,
        itemModule: TModule,
        media: TMedia,
      }


export { TMedia, TMediaDetailsMain, TMediaDetailsMedia, TCarousel }