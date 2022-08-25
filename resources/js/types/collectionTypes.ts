// collectionTypes.ts

type TView = 'Media' | 'Chips' | 'Table'
type TSource = 'main' | 'media' | 'related'
type TElement = 'array' | 'page' | 'viewIndex'

type TItemsPerPage = {
        Media: number,
        Chips: number,
        Table: number
}

interface IArrayItem { id: number, url_id: string }

interface IPageMediaItem extends IArrayItem {
        description: string
        primaryMedia: { full: string, tn: string } | null
}

interface IPageTableItem extends IArrayItem {
        description: string
}

interface IPageChipItemDisplay {
        id: number
        tag: string,
}

interface IPageMediaItemDisplay {
        id: number
        tag: string,
        description: string
        urls: { full: string, tn: string } | null
}

interface IPageTableItemDisplay {
        id: number,
        tag: string
        description: string
}

type TCollection = {
        array: IArrayItem[],
        index: number,
        page: IArrayItem[] | IPageMediaItem[] | IPageTableItem[],
        pageNoB1: number,
        views: TView[],
        viewIndex: number,
        ready: { array: boolean, index: boolean, page: boolean }
}

type TPageDisplayData = {
        page: IPageMediaItemDisplay[] | IPageTableItemDisplay[] | IPageChipItemDisplay[],
        pageNoB1: number,
        noOfItems: number,
        noOfPages: number,
        noOfItemsInCurrentPage: number,
        firstItemNo: number,
        lastItemNo: number
}

export { TView, TCollection, TElement, TSource, TItemsPerPage, TPageDisplayData, IArrayItem, IPageMediaItem, IPageTableItem, IPageChipItemDisplay, IPageMediaItemDisplay, IPageTableItemDisplay }