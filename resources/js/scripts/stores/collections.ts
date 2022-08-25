// collection.ts
//handles all collections and loading of chunks (pages)
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed, registerRuntimeCompiler } from 'vue'
import { TCollection, TSource, TElement, TItemsPerPage, TView, IArrayItem, TPageDisplayData, IPageMediaItem, IPageTableItem, IPageChipItemDisplay, IPageMediaItemDisplay, IPageTableItemDisplay } from '../../types/collectionTypes'
import { useXhrStore } from './xhr'
import { useRoutesStore } from './routes/routesMain'
import { useMediaStore } from './media'
import { useStatusStore } from './status'
import { useNotificationsStore } from './notifications'
export const useCollectionsStore = defineStore('collections', () => {
    const { send } = useXhrStore()
    const { to } = storeToRefs(useRoutesStore())
    let { bucketUrl } = storeToRefs(useMediaStore())
    let { module } = storeToRefs(useStatusStore())    
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

    const collectionMain = computed(() => {
        return {
            collection: main.value,
            pageNoB1: main.value.pageNoB1,
            noOfItems: main.value.array.length,
            noOfPages: Math.floor(main.value.array.length / itemsPerPage.value[<TView>main.value.views[main.value.viewIndex]]),
            noOfItemsInCurrentPage: main.value.page.length
        }
    })

    const cMain = computed(() => {
        return getCollectionDisplayData('main')
    })

    const collection = computed((name: TSource) => {
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
    })


    function getCollection(name: TSource): TCollection {
        switch (name) {
            case 'main':
                return main.value
            case 'media':
                return media.value
            case 'related':
                return related.value
            default:
                return main.value
        }
    }

    function getCollectionDisplayData(name: TSource): TPageDisplayData {
        let c = getCollectionByName(name)
        let ipp = itemsPerPage.value[<TView>c.views[c.viewIndex]]
        let view = c.views[c.viewIndex]
        let page, pageFormatted

        function getUrls(urls: object | null) : object {
            if(urls === null){
                return {
                    full: `${bucketUrl.value}app/filler/${module.value.name}Filler.jpg`,
                    tn: `${bucketUrl.value}app/filler/${module.value.name}Filler-tn.jpg`
                  }
            } else {
                return { full: null, tn: null}
            }
        }

        switch (view) {
            case 'Media':
                page = c.page as IPageMediaItem[]
                let urls = {}
                pageFormatted = page.map(x => { return { id: x.id, tag: x.url_id, description: x.description, urls: getUrls(x.primaryMedia) } }) as IPageMediaItemDisplay[]
                break;

            case 'Chips':
                page = c.page as IArrayItem[]
                pageFormatted = page.map(x => { return { id: x.id, tag: x.url_id } }) as IPageChipItemDisplay[]
                break;
            
            case 'Table':
                page = c.page as IPageTableItem[]
                pageFormatted = page.map(x => { return { id: x.id, tag: x.url_id, description: x.description } }) as IPageTableItemDisplay[]
                break;
        }




        return {

            pageNoB1: c.pageNoB1,
            noOfItems: c.array.length,
            noOfPages: Math.floor(c.array.length / ipp) + (c.array.length % ipp === 0 ? 0 : 1),
            noOfItemsInCurrentPage: c.page.length,
            firstItemNo: (c.pageNoB1 - 1) * ipp + 1,
            lastItemNo: (c.pageNoB1 - 1) * ipp + c.page.length,
            page: pageFormatted
        }
    }

    function getCollectionByName(name: TSource): TCollection {
        switch (name) {
            case 'main':
                return main.value
                break
            case 'media':
                return media.value
                break
            case 'related':
                return related.value
            default:
                alert(`getCollectionByName() Bad array name: ${name}`)
                return main.value
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
                    main.value.page = main.value.array.slice(start, start + ipp) as IArrayItem[]
                    main.value.pageNoB1 = pageNoB1
                    return
                }
                n.showSpinner("Loading Page...")
                await send('model/page', 'post', { model: to.value.module, view, ids })
                    .then(res => {
                        main.value.page = res.data.page
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
    return { itemsPerPage, main, related, media, getCollection, getCollectionDisplayData, collectionMain, setCollectionElement, reset, cMain }
})