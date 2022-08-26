// collectionTypes.ts

type TView = 'Media' | 'Chips' | 'Table'
type TSource = 'main' | 'media' | 'related'
type TElement = 'array' | 'page' | 'viewIndex'

type TItemsPerPage = {
        Media: number,
        Chips: number,
        Table: number
}

//'main' array items
interface IArrayItem { id: number, url_id: string }

//raw data received from DB (from 'main, page('media') & page('table'))
interface IPage {
        id: number, 
        url_id: string, 
        description?: string,
        primaryMedia?: { full: string, tn: string } | null
}

//conversions ready for consumption for 'Media', 'Chip', and 'Table' views
interface IChipItem {
        id: number
        tag: string,
}

interface IMediaItem {
        id: number
        tag: string,
        description: string
        hasMedia: boolean,        
        urls: { full: string, tn: string } | null
}

interface ITableItem {
        id: number,
        tag: string
        description: string
}
//union of the above
type IPageDisplay = IMediaItem | IChipItem | ITableItem


//all the data kept in a specific collection
type TCollection = {
        array: IArrayItem[],
        index: number,
        page: IPageDisplay[],
        pageNoB1: number,
        views: TView[],
        viewIndex: number,
        ready: { array: boolean, index: boolean, page: boolean }
}

type TPageDisplayData = {
        page: IPageDisplay[],
        pageNoB1: number,
        noOfItems: number,
        noOfPages: number,
        noOfItemsInCurrentPage: number,
        firstItemNo: number,
        lastItemNo: number
}

export { TView, TCollection, TElement, TSource, IPage, TItemsPerPage, TPageDisplayData, IPageDisplay, IArrayItem, IChipItem, IMediaItem, ITableItem }