// collection.ts
//handles all collections and loading of pages
import { defineStore } from 'pinia'
import { ref, computed, registerRuntimeCompiler } from 'vue'
import { TCollection, TCollectionName, TElement, TItemsPerPage, TDBPage, TPageItem, TView, TArrayItem, TCollectionMeta, TSetPage, TPageItemMedia, TPageItemTable, TPageItemChip } from '../../types/collectionTypes'
import { TMediaItem } from '../../types/mediaTypes'

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
        itemIndex: -1,
        ready: { array: false, index: false, page: false },
    })

    const media = ref<TCollection>({
        length: 0,
        index: 0,
        pageNoB1: 1,
        views: ["Media"] as TView[],
        viewIndex: 0,
        itemIndex: -1,
        ready: { array: false, index: false, page: false }
    })

    const related = ref<TCollection>({
        length: 0,
        index: 0,
        pageNoB1: 1,
        views: ["Media", "Chips"] as TView[],
        viewIndex: 0,
        itemIndex: -1,
        ready: { array: false, index: false, page: false }
    })

    let mainArray = ref<TArrayItem[]>([])
    let mediaArray = ref<TArrayItem[]>([])
    let relatedArray = ref<TArrayItem[]>([])

    let mainPageArray = ref<TPageItem[]>([])
    let relatedPageArray = ref<TPageItem[]>([])
    let mediaPageArray = ref<TPageItem[]>([])

    function getPageArray(source: TCollectionName) {
        switch (source) {
            case 'main':
                return mainPageArray
            case 'related':
                return relatedPageArray
            case 'media':
                return mediaPageArray
        }
    }

    function getCollectionArray(source: TCollectionName) {
        switch (source) {
            case 'main':
                return mainArray
            case 'related':
                return relatedArray
            case 'media':
                return mediaArray
        }
    }

    function getCollectionMeta(name: TCollectionName) {
        switch (name) {
            case 'main':
                return main
            case 'media':
                return media
            case 'related':
                return related
        }
    }

    function collectionMeta(name: TCollectionName): TCollectionMeta {
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

    function setArray(name: TCollectionName, data: TArrayItem[]) {
        let array = getCollectionArray(name)
        let meta = getCollectionMeta(name)
        array.value = data
        meta.value.length = data.length
    }

    async function loadPage(name: TCollectionName, pageNoB1: number, viewIndex: number, module: TModule): Promise<boolean> {
        let view = main.value.views[viewIndex]
        let ipp = itemsPerPage.value[view]
        let meta = getCollectionMeta(name)
        let start = (pageNoB1 - 1) * ipp;
        let array = getCollectionArray(name)
        let ids = array.value.slice(start, start + ipp).map(x => x.id);

        console.log(`loadPage() source: ${name}  module: ${module} viewIndex: ${viewIndex} pageB1: ${pageNoB1}  ipp: ${ipp} startIndex: ${start} endIndex: ${start + ipp - 1}`);

        switch (name) {
            case 'main':
                if (view === 'Chips') {
                    savePage('main', array.value.slice(start, start + ipp), view, module)
                    meta.value.pageNoB1 = pageNoB1
                    meta.value.viewIndex = viewIndex
                    return true
                }

                if (ids.length === 0) {
                    //console.log(`ids.length is 0 - returning`)
                    savePage('main', [], view, module)
                    return true
                }
                await send('model/page', 'post', { model: module, view, ids })
                    .then(res => {
                        console.log(`model.page() returned (success)`)
                        savePage('main', res.data.page, view, module)
                        meta.value.pageNoB1 = pageNoB1
                        meta.value.viewIndex = viewIndex
                        return true
                    })
                    .catch(err => {
                        showSnackbar(`Navigation to new routes failed. Navigation cancelled`)
                        console.log(`Navigation to new routes failed with err: ${JSON.stringify(err, null, 2)}`)
                        return false
                    })
                    .finally(() => {
                        console.log(`model.page() finally`)
                        return true
                    })
            default:
                return false

        }
        return true
    }

    function savePage(name: TCollectionName, page: TDBPage[], view: TView, module: TModule): void {
        function getMedia(urls: { full: string, tn: string } | null | undefined): TMediaItem {
            if (urls === null || urls === undefined) {
                return {
                    hasMedia: false,
                    urls: {
                        full: `${bucketUrl}app/filler/${module}Filler.jpg`,
                        tn: `${bucketUrl}app/filler/${module}Filler-tn.jpg`
                    }
                }
            } else {
                return {
                    hasMedia: true,
                    urls: {
                        full: `${bucketUrl}db/${urls?.full}`,
                        tn: `${bucketUrl}db/${urls?.tn}`
                    }
                }
            }
        }

        let bucketUrl = getBucketUrl()
        let toSave = []
        let pageRef = getPageArray(name)

        switch (view) {
            case 'Media':

                toSave = page.map(x => {
                    const media1 = getMedia(x.primaryMedia)
                    const item = { id: x.id, url_id: x.url_id, tag: x.url_id, description: x.description }
                    return { item, media: media1 }
                })
                pageRef.value = <TPageItemMedia[]>toSave
                break;

            case 'Chips':
                toSave = page.map(x => { return { id: x.id, url_id: x.url_id, tag: x.url_id } })
                pageRef.value = <TPageItemChip[]>toSave
                break;

            case 'Table':
                toSave = page.map(x => { return { id: x.id, url_id: x.url_id,  tag: x.url_id,description: x.description } })
                pageRef.value = <TPageItemTable[]>toSave
                break;
        }
        //console.log(`Saving page: ${JSON.stringify(toSave, null, 2)}`)
        //pageRef.value = <TPageItemMedia[]>toSave
    }

    async function toggleCollectionView(name: TCollectionName) {
        let { getModule } = useRoutesMainStore()
        let module = getModule()
        let meta = getCollectionMeta(name)
        let newViewIndex = (meta.value.viewIndex + 1) % meta.value.views.length

        //console.log(`toggleCollectionView() source: ${name}  module: ${module} views: ${meta.value.views}  current viewIndex: ${meta.value.viewIndex}  new viewIndex: ${newViewIndex}`);
        await loadPage(name, 1, newViewIndex, module)
    }

    function setItemsPerPage(ipp: TItemsPerPage) {
        itemsPerPage.value = ipp
    }

    function itemClear() {
        main.value.itemIndex = -1
    }

    async function loadPageByItemIndex(module: TModule) {
        let ipp = itemsPerPage.value[main.value.views[main.value.viewIndex]]
        let pageNoB0 = Math.floor(main.value.itemIndex / ipp)
        console.log(`ipp: ${ipp}) pageNoB1: ${pageNoB0 + 1} module: ${module}`)
        await loadPage('main', pageNoB0 + 1, main.value.viewIndex, module)
    }

    function getItemIndexInMainCollection(id: number) {
        let index = mainArray.value.findIndex(x => x.id === id)
        //console.log(`getItemIndexInMainCollection(id:${id}) index: ${index}`)
        return index

    }

    function setItemIndexInMainCollection(index: number) {
        //console.log(`setItemIndexInMainCollection to ${index}`)
        main.value.itemIndex = index
    }

    function itemIdsByIndex(name: TCollectionName, index: number) {
        //console.log(`setItemIndexInMainCollection to ${index}`)
        switch (name) {
            case 'main':
                return mainArray.value[index]
            case 'related':
                return relatedArray.value[index]
            case 'media':
                return mediaArray.value[index]
        }
    }

    function nextUrlId(isRight: boolean) {
        let newIndex
        if (isRight) {
            newIndex = (main.value.itemIndex === main.value.length - 1) ? 0 : main.value.itemIndex + 1
        } else {
            newIndex = (main.value.itemIndex === 0) ? main.value.length - 1 : main.value.itemIndex - 1
        }
        //console.log(`nextUrlId: ${mainArray.value[newIndex].url_id}`)
        //TODO change id to url_id
        return mainArray.value[newIndex].id
    }

    function clearCollections() {
        mainArray.value = []
        mainPageArray.value = []
        main.value.index = 0
        main.value.viewIndex = 0
        main.value.itemIndex = -1
        main.value.pageNoB1 = 1

        mediaArray.value = []
        mediaPageArray.value = []
        media.value.index = 0
        media.value.viewIndex = 0
        media.value.itemIndex = -1
        media.value.pageNoB1 = 1

        relatedArray.value = []
        relatedPageArray.value = []
        related.value.index = 0
        related.value.viewIndex = 0
        related.value.itemIndex = -1
        related.value.pageNoB1 = 1
    }

    async function firstUrlId() {
        let xhr = useXhrStore();
        let n = useNotificationsStore();
        let { current } = useRoutesMainStore()

        console.log(`firstUrlId model: ${current.module}`)
        n.showSpinner(`Finding first item ...`)
        return xhr.send('model/firstUrlId', 'post', { model: current.module })
            .then(res => {
                console.log(`firstUrlId() returned ${res.data.url_id}`)
                //console.log(`show() returned (success). res: ${JSON.stringify(res, null, 2)}`)
                //i.fields = res.data.item
                return res.data.url_id
            })
            .catch(err => {
                console.log(`firstUrlId() failed`)
                return false
            })
            .finally(() => {
                n.showSpinner(false)
            })
    }

    return {
        main,
        mainArray,
        mainPageArray,
        itemsPerPage,
        itemIdsByIndex,
        setItemsPerPage,
        collectionMeta,
        setArray,
        loadPage,
        toggleCollectionView,
        clearCollections,
        getPageArray,
        nextUrlId,
        getItemIndexInMainCollection,
        setItemIndexInMainCollection,
        loadPageByItemIndex,
        itemClear,
        firstUrlId
    }
})