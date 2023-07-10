// collectionTypes.ts

import { TMedia, TApiMedia, TApiMediaOrNull } from '@/js/types/mediaTypes'
import { TModule } from '@/js/types/routesTypes'

type TCollectionView = 'Image' | 'Chip' | 'Table'
type TCollectionName = 'main' | 'media' | 'related'

type TItemPerPagePerView = { Image: number, Chip: number, Table: number }

//array types
type TApiArrayMain = { id: number, url_id: string }
type TApiArrayMedia = number
type TApiArrayRelated = { module: TModule, id: number, url_id: string }

type TApiArray = TApiArrayMain | TApiArrayMedia | TApiArrayRelated

//page types (divided into ApiPageX and PageX groups)

//Api page types
type TApiPageMainImage = {
        id: number,
        url_id: string,
        slug: string,
        description: string,
        media1: TApiMediaOrNull
}

type TApiPageMainTable = {
        id: number,
        url_id: string,
        slug: string,
        tag: string,
        description: string,
}

type TApiPageMedia = TApiMedia & { id: number, description: string }

type TApiPage = TApiPageMainImage | TApiPageMainTable | TApiPageMedia | TApiArrayMain

//conversions ready for consumption for 'Media', 'Chip', and 'Table' views

type TPageVChip = {
        id: number,
        url_id: string,
        tag: string,
}

type TPageCMainVImage = {
        id: number,
        url_id: string,
        slug: string,
        tag: string,
        description: string
        media: TMedia
}

type TPageCMainVTable = {
        id: number,
        url_id: string,
        tag: string
        description: string
}

type TPageCMediaVImage = {
        id: number,
        media: TMedia,
        tag: string,
        description: string
}

//union of the above
type TPageItem = TPageCMainVImage | TPageCMainVTable | TPageVChip | TPageCMediaVImage

//internal collection data
type TCollectionExtra = {
        length: number,
        pageNoB1: number,
        views: TCollectionView[],
        viewIndex: number,
}

type TCollectionMeta = {
        views: TCollectionView[],
        viewIndex: number,
        view: TCollectionView,
        itemsPerPage: number,
        pageNoB1: number,
        noOfItems: number,
        noOfPages: number,
        noOfItemsInCurrentPage: number,
        firstItemNo: number,
        lastItemNo: number,
        length: number
}

export {
        TCollectionName,
        TCollectionView,
        TItemPerPagePerView,
        TCollectionExtra,
        TCollectionMeta,
        TApiArrayMain,
        TApiArrayMedia,
        TApiArrayRelated,
        TApiArray,
        TApiPageMainImage,
        TApiPageMainTable,
        TApiPageMedia,
        TApiPage,
        TPageVChip,
        TPageCMainVImage,
        TPageCMainVTable,
        TPageCMediaVImage,
        TPageItem,
        TApiMedia,
        TApiMediaOrNull
}