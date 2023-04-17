// collectionTypes.ts
import { TApiMediaOrNull } from '@/js/types/apiTypes'
import { TMedia } from '@/js/types/mediaTypes'

type TCollectionViews = 'Image' | 'Chip' | 'Table'
type TCollectionName = 'main' | 'media' | 'related'
type TElement = 'array' | 'page' | 'viewIndex'

type TItemsPerPage = number[]

type TSetPage = {
        pageNoB1: number,
        viewIndex: number
}


//conversions ready for consumption for 'Media', 'Chip', and 'Table' views

type TPageVChip = {
        id: number,
        url_id: string,
        tag: string,
}

type TPageCMainVImage = {
        id: number,
        url_id: string,
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
        media: TMedia,
        tag: string
        description?: string,
}

//union of the above
type TPageItem = TPageCMainVImage | TPageCMainVTable | TPageVChip | TPageCMediaVImage


//all the data kept in a specific collection
type TCollectionMeta = {
        length: number,
        pageNoB1: number,
        views: TCollectionViews[],
        viewIndex: number,
        //itemIndex: number,
        //ready: { array: boolean, index: boolean, page: boolean }
}

type TGetCollectionMeta = {
        views: TCollectionViews[],
        viewIndex: number,
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
        TCollectionViews,
        TCollectionMeta,
        TElement,
        TCollectionName,
        TItemsPerPage,
        TGetCollectionMeta,
        TPageItem,
        TSetPage,
        TPageVChip,
        TPageCMainVImage,
        TPageCMainVTable,
        TPageCMediaVImage
}