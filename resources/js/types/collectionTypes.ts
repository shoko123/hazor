// collectionTypes.ts
import { TApiMedia } from '@/js/types/apiTypes'
import { TMedia } from '@/js/types/mediaTypes'
enum ECollectionViews { Image, Chip, Table }
// Media' | 'Chips' | 'Table'
type TCollectionName = 'main' | 'media' | 'related'
type TElement = 'array' | 'page' | 'viewIndex'

type TItemsPerPage = number[]

type TSetPage = {
        pageNoB1: number,
        viewIndex: number
}


//conversions ready for consumption for 'Media', 'Chip', and 'Table' views

type TPageItemChip = {
        id: number,
        url_id: string,
        tag: string,
}

type TPageMainImage = {
        id: number,
        url_id: string,
        tag: string,
        description: string
        media: TMedia
}

type TPageMainTable = {
        id: number,
        url_id: string,
        tag: string
        description: string
}

type TPageItemMedia = {
        media: TMedia,
        tag: string
        description?: string,
}
//union of the above
type TPageItem = TPageMainImage | TPageMainTable | TPageItemChip | TPageItemMedia


//all the data kept in a specific collection
type TCollectionMeta = {
        length: number,
        pageNoB1: number,
        views: ECollectionViews[],
        viewIndex: number,
        //itemIndex: number,
        //ready: { array: boolean, index: boolean, page: boolean }
}

type TGetCollectionMeta = {
        views: ECollectionViews[],
        viewIndex: number,
        pageNoB1: number,
        noOfItems: number,
        noOfPages: number,
        noOfItemsInCurrentPage: number,
        firstItemNo: number,
        lastItemNo: number,
        length: number
}


export { ECollectionViews, TCollectionMeta, TElement, TCollectionName, TItemsPerPage, TGetCollectionMeta, TPageItem, TSetPage, TPageItemChip, TPageMainImage, TPageMainTable }