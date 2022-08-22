// collectionTypes.ts

type TView = 'Media' | 'Chips' | 'Table'
type TSource = 'main' | 'media' | 'related'
type TElement = 'array' | 'page' | 'viewIndex'
type TItemsPerPage = {
        Media: number,
        Chips: number,
        Table: number
}

type TArrayItem = { id: number, url_id: string }
interface IPageMediaItem extends TArrayItem {
        url: { full: string, tn: string} | null
}

interface IPageTableItem extends TArrayItem {
        description: string
}

type TCollection = {
        array: TArrayItem[],
        index: number,
        page: IPageMediaItem[] | IPageTableItem[],
        views: TView[],
        viewIndex: number,
        ready: { array: boolean, index: boolean, page: boolean }
}

export { TView, TCollection, TElement, TSource, TItemsPerPage, TArrayItem, IPageMediaItem, IPageTableItem }