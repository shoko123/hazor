// mediaTypes.ts
import { TApiMedia } from '@/js/types/collectionTypes'
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
        media: TApiMedia,
        module: TModule
}

type TApiCarouselMedia = {
        id: number,
        description: string,
        full: string,
        tn: string,
        collection_name: string,
        order_column: number,
}

type TApiCarousel = TApiCarouselMedia | TApiCarouselMain

type TCarouselMain = {
        id: number,
        url_id: string,
        description: string,
        module: TModule
}

type TCarouselMedia = {
        id: number,
        description: string,
        collection_name: string,
        order_column: number,
}

type TCarousel = TCarouselMain | TCarouselMedia



export {
        TMedia,
        TImageableDetailsMain,
        TImageableDetailsMedia,
        TImageableDetails,
        TApiCarousel,
        TApiCarouselMedia,
        TApiCarouselMain,
        TCarouselMain,
        TCarouselMedia,
        TCarousel,
}