// collection.ts
//handles all collections and loading of pages
import { defineStore } from 'pinia'
import { ref, computed, registerRuntimeCompiler } from 'vue'
import { TCollection, TSource, TElement, TItemsPerPage, IPage, IPageItem, TView, TArrayItem, TCollectionMeta, TSetPage, IMediaItem, ITableItem } from '../../types/collectionTypes'
import { TModule } from '../../types/routesTypes'
import { useRoutesMainStore } from './routes/routesMain'
import { useXhrStore } from './xhr'
import { useMediaStore } from './media'
import { useNotificationsStore } from './notifications'

export const useCollectionsStore = defineStore('collections', () => {
    const { send } = useXhrStore()
    const { showSnackbar } = useNotificationsStore()
    const { getBucketUrl } = useMediaStore()
    
    const itemsPerPage = ref<TItemsPerPage>({
        Media: 0,
        Chips: 0,
        Table: 0,
    })

    let main = ref<TCollection>({
        length: 0,
        index: 0,
        pageNoB1: 1,
        views: ["Media", "Chips", "Table"] as TView[],
        viewIndex: 0,
        ready: { array: false, index: false, page: false }
    })

    const media = ref<TCollection>({
        length: 0,
        index: 0,
        pageNoB1: 1,
        views: ["Media"] as TView[],
        viewIndex: 0,
        ready: { array: false, index: false, page: false }
    })

    const related = ref<TCollection>({
        length: 0,
        index: 0,
        pageNoB1: 1,
        views: ["Media", "Chips"] as TView[],
        viewIndex: 0,
        ready: { array: false, index: false, page: false }
    })

    let mainArray = ref<TArrayItem[]>([])
    let mediaArray = ref<TArrayItem[]>([])
    let relatedArray = ref<TArrayItem[]>([])

    let mainPageArray = ref<IPageItem[]>([])
    let relatedPageArray = ref<IPageItem[]>([])
    let mediaPageArray = ref<IPageItem[]>([])

    function getPageArray(source: TSource) {
        switch (source) {
            case 'main':
                return mainPageArray
            case 'related':
                return relatedPageArray
            case 'media':
                return mediaPageArray
        }
    }

    function getCollectionArray(source: TSource) {
        switch (source) {
            case 'main':
                return mainArray
            case 'related':
                return relatedArray
            case 'media':
                return mediaArray
        }
    }

    function getCollectionMeta(name: TSource) {
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
        //console.log(`collectionMeta("${name}")`)
        let meta = getCollectionMeta(name)
        let ipp = itemsPerPage.value[<TView>meta.value.views[meta.value.viewIndex]]
        let noOfPages = Math.floor(meta.value.length / ipp) + (meta.value.length % ipp === 0 ? 0 : 1)
        let pageArr = getPageArray(name)
        return {
            views: meta.value.views,
            viewIndex: meta.value.viewIndex,
            pageNoB1: meta.value.pageNoB1,
            noOfItems: meta.value.length,
            noOfPages,
            noOfItemsInCurrentPage: pageArr.value.length,
            firstItemNo: (meta.value.pageNoB1 - 1) * ipp + 1,
            lastItemNo: (meta.value.pageNoB1 - 1) * ipp + pageArr.value.length,
            length: meta.value.length
        }
    }

    function setArray(name: TSource, data: TArrayItem[]) {
        let array = getCollectionArray(name)
        let meta = getCollectionMeta(name)
        array.value = data
        meta.value.length = data.length
    }

    async function setPage(name: TSource, pageNoB1: number, viewIndex: number, module: TModule) {
        let view = main.value.views[viewIndex]
        let ipp = itemsPerPage.value[view]
        let meta = getCollectionMeta(name)
        let start = (pageNoB1 - 1) * ipp;
        let array = getCollectionArray(name)
        let ids = array.value.slice(start, start + ipp).map(x => x.id);

        console.log(`setPage() source: ${name}  module: ${module} viewIndex: ${viewIndex} pageB1: ${pageNoB1}  ipp: ${ipp} startIndex: ${start} endIndex: ${start + ipp - 1}`);

        switch (name) {
            case 'main':
                if (view === 'Chips') {
                    savePage('main', array.value.slice(start, start + ipp), view, module)
                    meta.value.pageNoB1 = pageNoB1
                    meta.value.viewIndex = viewIndex
                    return true
                }

                if (ids.length === 0) {
                    savePage('main', [], view, module)
                }
                await send('model/page', 'post', { model: module, view, ids })
                    .then(res => {
                        console.log(`setPage() returned (success)`)
                        savePage('main', res.data.page, view, module)
                        meta.value.pageNoB1 = pageNoB1
                        meta.value.viewIndex = viewIndex
                    })
                    .catch(err => {
                        showSnackbar(`Navigation to new routes failed. Navigation cancelled`)
                        console.log(`Navigation to new routes failed with err: ${JSON.stringify(err, null, 2)}`)
                        return false
                    })
                    .finally(() => {
                        console.log(`setPage() finally`)
                    })
        }
    }

    function savePage(name: TSource, page: IPage[], view: TView, module: TModule): void {
        function getUrls(urls: { full: string, tn: string } | null | undefined): object | null {
            if (urls === null) {

                return {
                    full: `${bucketUrl}app/filler/${module}Filler.jpg`,
                    tn: `${bucketUrl}app/filler/${module}Filler-tn.jpg`
                }
            } else {
                return {
                    full: `${bucketUrl}db/${urls?.full}`,
                    tn: `${bucketUrl}db/${urls?.tn}`
                }
            }
        }
        
        let bucketUrl = getBucketUrl()
        let toSave = []
        let pageRef = getPageArray(name)

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
        //console.log(`Saving page: ${JSON.stringify(toSave, null, 2)}`)
        pageRef.value = toSave
    }

    function toggleCollectionView(name: TSource) {
        let { getModule }  = useRoutesMainStore()        
        let module = getModule()        
        let meta = getCollectionMeta(name)
        let newViewIndex = (meta.value.viewIndex + 1) % meta.value.views.length

        //console.log(`toggleCollectionView() source: ${name}  module: ${module} views: ${meta.value.views}  current viewIndex: ${meta.value.viewIndex}  new viewIndex: ${newViewIndex}`);
        setPage(name, 1, newViewIndex, module)
    }

    function setItemsPerPage(ipp: TItemsPerPage) {
        itemsPerPage.value = ipp
    }

    function clearCollections() {
        mainArray.value = []
        mainPageArray.value = []
        main.value.index = 0
        main.value.viewIndex = 0
        main.value.pageNoB1 = 1

        mediaArray.value = []
        mediaPageArray.value = []
        media.value.index = 0
        media.value.viewIndex = 0
        media.value.pageNoB1 = 1

        relatedArray.value = []
        relatedPageArray.value = []
        related.value.index = 0
        related.value.viewIndex = 0
        related.value.pageNoB1 = 1

    }
    return { setItemsPerPage, main, collectionMeta, setArray, setPage, toggleCollectionView, clearCollections, getPageArray, mainArray, mainPageArray }
})