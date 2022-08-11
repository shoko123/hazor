// collectionTypes.ts

type TView = 'Media' | 'Chips' | 'Table'
type TCollection = {
        array: [],
        index: number,
        chunk: [],
        viewIndex: number,
        views: TView[],
        chunkIndex: number,
}
const itemPerPagePerView = {
        Media: 18,
        Chips: 100,
        Table: 50
    }
export  { TView, TCollection, itemPerPagePerView}