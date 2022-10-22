// collection.ts
//handles all collections and loading of pages
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed, registerRuntimeCompiler } from 'vue'
import { TCollection, TSource, TElement, TItemsPerPage, IPage, IPageItem, TView, TArrayItem, TCollectionMeta, IChipItem, IMediaItem, ITableItem } from '../../types/collectionTypes'
import { useXhrStore } from './xhr'
import { useRoutesStore } from './routes/routesMain'
import { useMediaStore } from './media'
import { useNotificationsStore } from './notifications'

export const useCollectionsStore = defineStore('collections', () => {
    const { send } = useXhrStore()
    const { to, current } = storeToRefs(useRoutesStore())
    let { bucketUrl } = storeToRefs(useMediaStore())
    let n = useNotificationsStore()

    const itemsPerPage = ref<TItemsPerPage>({
        Media: 0,
        Chips: 0,
        Table: 0,
    })

    let main = ref<TCollection>({
        length: 0,
        index: 0,
        pageNoB1: 1,
        views: ["Media", "Chips", "Table"],
        viewIndex: 0,
        ready: { array: false, index: false, page: false }
    })

    const media = ref<TCollection>({
        length: 0,
        index: 0,
        pageNoB1: 1,
        views: ["Media"],
        viewIndex: 0,
        ready: { array: false, index: false, page: false }
    })

    const related = ref<TCollection>({
        length: 0,
        index: 0,
        pageNoB1: 1,
        views: ["Media", "Chips"],
        viewIndex: 0,
        ready: { array: false, index: false, page: false }
    })

    let mainArray = ref<TArrayItem[]>([])
    let mediaArray = ref<TArrayItem[]>([])
    let relatedArray = ref<TArrayItem[]>([])

    let mainPageArray = ref<IPageItem[]>([])
    let relatedPageArray = ref<IPageItem[]>([])
    let mediaPageArray = ref<IPageItem[]>([])

    function pageArrayRef(source: TSource) {
        switch (source) {
            case 'main':
                return mainPageArray
            case 'related':
                return relatedPageArray
            case 'media':
                return mediaPageArray
        }
    }

    function collectionArrayRef(source: TSource) {
        switch (source) {
            case 'main':
                return mainArray
            case 'related':
                return relatedArray
            case 'media':
                return mediaArray
        }
    }

    function collectionMetaRef(name: TSource) {
        switch (name) {
            case 'main':
                return main
            case 'media':
                return media
            case 'related':
                return related
        }
    }

    function collectionMeta(name: TSource): TCollectionMeta {
        let meta = collectionMetaRef(name)
        let ipp = itemsPerPage.value[<TView>meta.value.views[meta.value.viewIndex]]
        let noOfPages = Math.floor(meta.value.length / ipp) + (meta.value.length % ipp === 0 ? 0 : 1)
        let pageArr = pageArrayRef(name)
        console.log(`collectionMeta`)
        return {
            views: meta.value.views,
            viewIndex: meta.value.viewIndex,
            pageNoB1: meta.value.pageNoB1,
            noOfItems: meta.value.length,
            noOfPages,
            noOfItemsInCurrentPage: pageArr.value.length,
            firstItemNo: (meta.value.pageNoB1 - 1) * ipp + 1,
            lastItemNo: (meta.value.pageNoB1 - 1) * ipp + pageArr.value.length,
        }
    }

    async function setCollectionElement(name: TSource, element: TElement, data: number | TView | object[]) {
        console.log(`setCollection("${name}") Element("${element}")`)
        switch (element) {
            case 'array':
                setArray(name, data)
                break
            case 'page':
                setPage(name, <number>data)
                break
            case 'viewIndex':
                setViewIndex(name, <number>data)
                break
        }
    }

    function setViewIndex(name: TSource, vi: number) {
        let meta = collectionMetaRef(name)
        meta.value.viewIndex = vi

        //When changing views, always reset page number to 1.
        setPage(name, 1)
    }

    function setArray(name: TSource, data: any) {
        //To save on array.length recalculation, in addition to setting the array, we set meta.length
        let array = collectionArrayRef(name)
        let meta = collectionMetaRef(name)
        array.value = data
        meta.value.length = data.length
    }


    async function setPage(name: TSource, pageNoB1: number) {
        let view = main.value.views[main.value.viewIndex]
        let ipp = itemsPerPage.value[view]
        let meta = collectionMetaRef(name)
        let start = (pageNoB1.valueOf() - 1) * ipp;
        let array = collectionArrayRef(name)
        let ids = array.value.slice(start, start + ipp).map(x => x.id);
        
        console.log(`setPage() source: ${name} pageB1: ${pageNoB1} start: ${start} ipp: ${ipp}`);

        switch (name) {
            case 'main':
                if (view === 'Chips') {
                    savePage('main', array.value.slice(start, start + ipp), view)
                    meta.value.pageNoB1 = pageNoB1
                    return true
                }
                await send('model/page', 'post', { model: to.value.module, view, ids })
                    .then(res => {
                        console.log(`setPage() returned (success)`)
                        savePage('main', res.data.page, view)
                    })
                    .catch(err => {
                        n.showSnackbar(`Navigation to new routes failed. Navigation cancelled`)
                        console.log(`Navigation to new routes failed with err: ${JSON.stringify(err, null, 2)}`)
                        return false
                    })
                    .finally(() => {
                        console.log(`setPage() finally`)
                        meta.value.pageNoB1 = pageNoB1
                    })
        }
    }

    function savePage(name: TSource, page: IPage[], view: TView): void {
        function getUrls(urls: { full: string, tn: string } | null | undefined): object | null {
            if (urls === null) {
                return {
                    full: `${bucketUrl.value}app/filler/${current.value.module}Filler.jpg`,
                    tn: `${bucketUrl.value}app/filler/${current.value.module}Filler-tn.jpg`
                }
            } else {
                return {
                    full: `${bucketUrl.value}db/${urls?.full}`,
                    tn: `${bucketUrl.value}db/${urls?.tn}`
                }
            }
        }

        let toSave = []
        let pageRef = pageArrayRef(name)
        switch (view) {
            case 'Media':
                toSave = page.map(x => { return { id: x.id, tag: x.url_id, description: x.description, hasMedia: x.primaryMedia !== null, urls: getUrls(x.primaryMedia) } })
                break;

            case 'Chips':
                toSave = page.map(x => { return { id: x.id, tag: x.url_id } })
                break;

            case 'Table':
                toSave = page.map(x => { return { id: x.id, tag: x.url_id, description: x.description } })
                break;
        }
        pageRef.value = toSave
    }

    function reset() {
        mainArray.value = []
        mainPageArray.value = []
        main.value.index = 0
        main.value.viewIndex = 0
        mediaArray.value = []
        mediaPageArray.value = []
        media.value.index = 0
        media.value.viewIndex = 0
        relatedArray.value = []
        relatedPageArray.value = []
        related.value.index = 0
        related.value.viewIndex = 0
    }
    return { itemsPerPage, main, collectionMeta, setCollectionElement, reset, pageArrayRef, mainArray }
})