// mediaTypes.ts
import { TModule } from '@/js/types/routesTypes'

//raw api returned by both page (all collections) and item.show.
type TMediaUrls = { full: string, tn: string }
type TMediaRecord = TMediaUrls & { id: number, file_name: string }


//for consumption by frontend. May either have an actual item image, or a placeholder.
type TMediaOfItem = {
        hasMedia: boolean,
        urls: TMediaUrls,
}

//Params passed as props to MediaSquare, and Overlay components
type TImageableDetailsMain = {
        id: number,
        slug: string,
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
        slug: string,
        description: string,
        media: TMediaUrls | null,
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
        slug: string, 
        tag: string,
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
        TMediaUrls,
        TMediaOfItem,
        TImageableDetailsMain,
        TImageableDetailsMedia,
        TImageableDetails,
        TApiCarousel,
        TApiCarouselMedia,
        TApiCarouselMain,
        TCarouselMain,
        TCarouselMedia,
        TCarousel,
        TMediaRecord
}