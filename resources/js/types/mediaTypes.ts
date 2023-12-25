// mediaTypes.ts
import { TModule } from '@/js/types/routesTypes'
import { TPageRelatedGallery } from '@/js/types/collectionTypes'
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

type TPageMedia = TMediaRecord

//Single carousel item, according to collectionName
type TApiCarouselMain = {
        id: number,
        slug: string,
        short: string,
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
        short: string,
        media: TMediaOfItem,
        module: TModule | undefined
}

type TCarouselRelated = TPageRelatedGallery
type TCarousel = TCarouselMain | TMediaRecord | TCarouselRelated

export {
        TMediaUrls,
        TMediaOfItem,
        TPageMedia,
        TApiCarousel,
        TApiCarouselMedia,
        TApiCarouselMain,
        TCarouselMain,
        TMediaRecord,
        TCarouselRelated,
        TCarousel,
}