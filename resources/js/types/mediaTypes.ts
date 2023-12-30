// mediaTypes.ts
import { TModule } from '@/js/types/routesTypes'
import { TPageRelatedGallery } from '@/js/types/collectionTypes'

type TMediaUrls = { full: string, tn: string }

//When an item has no related media, we use a placeholder media urls.
type TMediaOfItem = {
        hasMedia: boolean,
        urls: TMediaUrls,
}

//Single carousel items are retrived from the DB, according to their collection sources.
type TApiCarouselMain = {
        id: number,
        slug: string,
        short: string,
        urls: TMediaUrls | null,
        module: TModule
}

type TApiCarouselMedia = {
        id: number,
        urls: TMediaUrls,
        size: number,
        collection_name: string,
        file_name: string,
        order_column: number,
        title: string,
        text: string,
}
//type TApiCarouselRelated is absent as all the data needed is already loaded and saved at item.related[] and no DB access is required.

//types used by carousel.ts
type TCarouselMain =  {
        id: number,
        slug: string,
        short: string,
        media: TMediaOfItem,
        module: TModule
        tag: string,
}

type TCarouselMedia = {
        id: number,
        media: TMediaOfItem,
        size: string,
        collection_name: string,
        file_name: string,
        order_column: number,
        title?: string,
        text?: string
}

type TCarouselRelated = TPageRelatedGallery

type TCarousel = TCarouselMain | TCarouselMedia | TCarouselRelated

export {
        TMediaUrls,
        TMediaOfItem,
        TApiCarouselMedia,
        TApiCarouselMain,
        TCarouselMain,
        TCarouselMedia,
        TCarouselRelated,
        TCarousel,
}