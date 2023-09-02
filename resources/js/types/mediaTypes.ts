// mediaTypes.ts
import { TModule } from '@/js/types/routesTypes'

//raw api returned by both page (all collections) and item.show.
type TMediaUrls = { full: string, tn: string }
type TMediaRecord = { 
        id: number, 
        urls: TMediaUrls, 
        size: string, 
        collection_name: string, 
        file_name: string, 
        order_column: number, 
        title?: string, 
        text?: string 
}


//for consumption by frontend. May either have an actual item image, or a placeholder.
type TMediaOfItem = {
        hasMedia: boolean,
        urls: TMediaUrls,
}

type TPageCMedia = TMediaRecord

//Single carousel item, according to collectionName
type TApiCarouselMain = {
        id: number,
        slug: string,
        description: string,
        media: TMediaUrls,
        module: TModule
}

type TApiCarouselMedia = {
        id: number,
        full: string,
        tn: string,
        size: number,
        collection_name: string,
        file_name: string,
        order_column: number,
        title: string,
        text: string,
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


// type TCarouselMedia = {
//         id: number,
//         full: string,
//         tn: string,
//         size: number,
//         collection_name: string,
//         file_name: string,
//         order_column: number,
//         title: string,
//         text: string,
// }

type TCarousel = TCarouselMain | TMediaRecord



export {
        TMediaUrls,
        TMediaOfItem,
        TPageCMedia,
        TApiCarousel,
        TApiCarouselMedia,
        TApiCarouselMain,
        TCarouselMain,
        //TCarouselMedia,
        TCarousel,
        TMediaRecord
}