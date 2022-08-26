// collection.ts
//handles all collections and loading of pages
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed, registerRuntimeCompiler } from 'vue'
import { TCollection, TSource, TElement, TItemsPerPage, IPage, IPageDisplay, TView, IArrayItem, TPageDisplayData, IChipItem, IMediaItem, ITableItem } from '../../types/collectionTypes'
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
        array: [],
        index: 0,
        page: [],
        pageNoB1: 1,
        views: ["Media", "Chips", "Table"],
        viewIndex: 0,
        ready: { array: false, index: false, page: false }
    })

    const media = ref<TCollection>({
        array: [],
        index: 0,
        page: [],
        pageNoB1: 1,
        views: ["Media"],
        viewIndex: 0,
        ready: { array: false, index: false, page: false }
    })

    const related = ref<TCollection>({
        array: [],
        index: 0,
        page: [],
        pageNoB1: 1,
        views: ["Media", "Chips"],
        viewIndex: 0,
        ready: { array: false, index: false, page: false }
    })

    const pageMain = computed(() => {
        return getCollectionDisplayData('main')
    })

    const viewsMain = computed(() => {
        return viewsData('main')
    })

    function viewsData(name: TSource) {
        const c = getCollectionRef(name)
        return { views: c.value.views, viewIndex: c.value.viewIndex, viewText: c.value.views[c.value.viewIndex] }
    }

    function getCollectionRef(name: TSource) {
        switch (name) {
            case 'main':
                return main
            case 'media':
                return media
            case 'related':
                return related
            default:
                return main
        }
    }

    function getCollectionDisplayData(name: TSource): TPageDisplayData {
        let c = getCollectionRef(name)
        let ipp = itemsPerPage.value[<TView>c.value.views[c.value.viewIndex]]

        return {
            pageNoB1: c.value.pageNoB1,
            noOfItems: c.value.array.length,
            noOfPages: Math.floor(c.value.array.length / ipp) + (c.value.array.length % ipp === 0 ? 0 : 1),
            noOfItemsInCurrentPage: c.value.page.length,
            firstItemNo: (c.value.pageNoB1 - 1) * ipp + 1,
            lastItemNo: (c.value.pageNoB1 - 1) * ipp + c.value.page.length,
            page: c.value.page
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
        switch (name) {
            case 'main':
                main.value.viewIndex = vi
                setPage(name, 1)
                break
            case 'media':
                media.value.viewIndex = vi
                break
            case 'related':
                related.value.viewIndex = vi
                break
            default:
                alert(`setViewIndex() Bad array name: ${name}`)
        }
    }

    function setArray(name: TSource, data: any) {
        //console.log(`setArray("${name}")`)
        switch (name) {
            case 'main':
                main.value.array = data
                break
            case 'media':
                media.value.array = data
                break
            case 'related':
                related.value.array = data
                break
            default:
                alert(`setArray() Bad array name: ${name}`)
        }
    }

    async function setPage(name: TSource, pageNoB1: number) {
        switch (name) {
            case 'main':
                let view = main.value.views[main.value.viewIndex]
                let ipp = itemsPerPage.value[view]
                let start = (pageNoB1.valueOf() - 1) * ipp;
                let ids = main.value.array.slice(start, start + ipp).map(x => x.id);
                console.log(`setPage() source: ${name} pageB1: ${pageNoB1} start: ${start} ipp: ${ipp}`);
                if (view === 'Chips') {
                    formatAndSavePage('main', main.value.array.slice(start, start + ipp))
                    main.value.pageNoB1 = pageNoB1
                    return
                }
                n.showSpinner("Loading Page...")
                await send('model/page', 'post', { model: to.value.module, view, ids })
                    .then(res => {
                        formatAndSavePage('main', res.data.page)
                        //main.value.page = res.data.page
                        console.log(`page() returned (success)`)
                        //console.log(`stPage() returned res: ${JSON.stringify(res, null, 2)}`)
                        // c.setCollectionElement('main', 'array', res.data.collection)
                        // c.setCollectionElement('main', 'viewIndex', 0)
                        // c.setCollectionElement('main', 'page', 1)
                        // return true
                    })
                    .catch(err => {
                        // n.showSnackbar(`Navigation to new routes failed. Navigation cancelled`)
                        // console.log(`Navigation to new routes failed with err: ${JSON.stringify(err, null, 2)}`)
                        // return false
                    })
                    .finally(() => {
                        main.value.pageNoB1 = pageNoB1
                        n.showSpinner(false)
                    })
        }
    }

    function formatAndSavePage(name: TSource, page: IPage[]): void {
        function getUrls(urls: { full: string, tn: string } | null | undefined): object | null {
            if (urls === null) {
                return {
                    full: `${bucketUrl.value}app/filler/${current.value.module}Filler.jpg`,
                    tn: `${bucketUrl.value}app/filler/${current.value.module}Filler-tn.jpg`
                }
            } else {
                return null
            }
        }


        let c = getCollectionRef(name)
        let view = c.value.views[c.value.viewIndex]
        let x
        switch (view) {
            case 'Media':
                c.value.page = page.map(x => { return { id: x.id, tag: x.url_id, description: x.description, hasMedia: x.primaryMedia !== null, urls: getUrls(x.primaryMedia) } })
                break;

            case 'Chips':
                c.value.page = page.map(x => { return { id: x.id, tag: x.url_id } })
                break;

            case 'Table':
                c.value.page = page.map(x => { return { id: x.id, tag: x.url_id, description: x.description } })
                break;
        }
    }

    function reset() {
        main.value.array = []
        main.value.page = []
        main.value.index = 0
        main.value.viewIndex = 0
        media.value.array = []
        media.value.page = []
        media.value.index = 0
        media.value.viewIndex = 0
        related.value.array = []
        related.value.page = []
        related.value.index = 0
        related.value.viewIndex = 0
    }
    return { itemsPerPage, main, viewsData, getCollectionDisplayData, setCollectionElement, reset, pageMain, viewsMain }
})