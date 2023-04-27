// mediaTypes.ts
import { TModule } from '@/js/types/routesTypes'

//raw api returned by both page (all collections) and item.show.
type TApiMedia = { full: string, tn: string }
type TApiMediaOrNull = TApiMedia | null

//for consumption by frontend. May either have an actual item image, or a placeholder.
type TMedia = {
        hasMedia: boolean,
        urls: { full: string, tn: string },
}

//Params passed as props to MediaSquare, and Overlay components
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

//Single carousel item, according to collectionName
type TApiCarouselMain = {
        id: number,
        url_id: string,
        description: string,
        media: TApiMediaOrNull,
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

//types used by carousel.ts
type TCarouselMain = {
        id: number,
        url_id: string,
        description: string,
        module: TModule | undefined
}

type TCarouselMedia = {
        id: number,
        description: string,
        collection_name: string,
        order_column: number,
}

type TCarousel = TCarouselMain | TCarouselMedia



export {
        TApiMedia,
        TApiMediaOrNull,
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