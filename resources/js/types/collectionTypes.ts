// collectionTypes.ts

type TView = 'Media' | 'Chips' | 'Table'
type TCollection = {
        array: object[],
        index: number,
        page: object[],
        views: TView[],
        viewIndex: number,
}
const itemPerPagePerView = {
        Media: 18,
        Chips: 100,
        Table: 50
}
export { TView, TCollection, itemPerPagePerView }