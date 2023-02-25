// collectionTypes.ts
import { TApiMedia } from '@/js/types/apiTypes'

type TView = 'Media' | 'Chips' | 'Table'
type TCollectionName = 'main' | 'media' | 'related'
type TElement = 'array' | 'page' | 'viewIndex'

type TItemsPerPage = {
        Media: number,
        Chips: number,
        Table: number
}

type TSetPage = {
        pageNoB1: number,
        viewIndex: number
}

//'main' array items
type TArrayItem = { id: number, url_id: string }

//raw data received from DB (from 'main, page('media') & page('table'))
type TDBPage = {
        id: number,
        url_id: string,
        description?: string,
        media1?: TApiMedia
}

//conversions ready for consumption for 'Media', 'Chip', and 'Table' views
type TPageItemChip = {
        id: number,
        url_id: string,
        tag: string,
}

type TPageItemMedia = {
        item: {
                id: number,
                url_id: string,
                tag: string,
                description: string
        },
        media: {
                hasMedia: boolean,
                urls: { full: string, tn: string }
        }
}

type TPageItemTable = {
        id: number,
        url_id: string,        
        tag: string
        description: string
}

//union of the above
type TPageItem = TPageItemMedia | TPageItemChip | TPageItemTable


//all the data kept in a specific collection
type TCollectionMeta = {
        length: number,
        pageNoB1: number,
        views: TView[],
        viewIndex: number,
        //itemIndex: number,
        //ready: { array: boolean, index: boolean, page: boolean }
}

type TGetCollectionMeta = {
        views: string[],
        viewIndex: number,
        pageNoB1: number,
        noOfItems: number,
        noOfPages: number,
        noOfItemsInCurrentPage: number,
        firstItemNo: number,
        lastItemNo: number,
        length: number
}


export { TView, TCollectionMeta, TElement, TCollectionName, TDBPage, TItemsPerPage, TGetCollectionMeta, TPageItem, TArrayItem, TSetPage, TPageItemChip, TPageItemMedia, TPageItemTable }