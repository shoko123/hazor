// collection.ts
//handles all collections and loading of pages
import { defineStore } from 'pinia'
import { ref, computed, registerRuntimeCompiler } from 'vue'
import { TCollectionMeta, TCollectionName, TElement, TItemsPerPage, TPageItem, TCollectionViews, TGetCollectionMeta, TPageCMediaVImage, TPageCMainVImage, TPageCMainVTable, TPageVChip } from '../../../types/collectionTypes'
import { TMedia } from '../../../types/mediaTypes'

import { TModule } from '../../../types/routesTypes'
import { TApiMedia, TApiMediaOrNull, TItemPerPagePerView, TApiArrayItemMain, TApiMainImage, TApiMainTable, TApiPageItem } from '@/js/types/apiTypes'
import { useRoutesMainStore } from '../routes/routesMain'
import { useXhrStore } from '../xhr'
import { useMediaStore } from '../media'
import { useNotificationsStore } from '../notifications'

export const useCollectionsStore = defineStore('collections', () => {
    const { send } = useXhrStore()
    const { showSnackbar } = useNotificationsStore()
    const { buildMedia } = useMediaStore()

    let itemsPerPagePerView = ref({
        Image: 0,
        Chip: 0,
        Table: 0
    })

    let main = ref<TCollectionMeta>({
        length: 0,
        pageNoB1: 1,
        views: ['Image', 'Chip', 'Table'],
        viewIndex: 0,
    })

    const media = ref<TCollectionMeta>({
        length: 0,
        pageNoB1: 1,
        views: ['Image'],
        viewIndex: 0,
    })

    const related = ref<TCollectionMeta>({
        length: 0,
        pageNoB1: 1,
        views: ['Image', 'Chip'],
        viewIndex: 0,
    })

    let mainArray = ref<TApiArrayItemMain[]>([])
    let mediaArray = ref<TApiArrayItemMain[]>([])
    let relatedArray = ref<TApiArrayItemMain[]>([])

    let mainPageArray = ref<TPageItem[]>([])
    let relatedPageArray = ref<TPageItem[]>([])
    let mediaPageArray = ref<TPageCMediaVImage[]>([])

    function getIpp(view: TCollectionViews): number {
        return itemsPerPagePerView.value[view]
    }

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

    function collectionMeta(name: TCollectionName): TGetCollectionMeta {
        //console.log(`collectionMeta("${name}")`)
        let meta = getCollectionMeta(name)
        let ipp = getIpp(meta.value.views[meta.value.viewIndex])
        let noOfPages = Math.floor(meta.value.length / ipp) + (meta.value.length % ipp === 0 ? 0 : 1)
        let pageArr = getPageArray(name)
        return {
            views: meta.value.views,//.map(x => ECollectionViews[x]),
            viewIndex: meta.value.viewIndex,
            itemsPerPage: ipp,
            pageNoB1: meta.value.pageNoB1,
            noOfItems: meta.value.length,
            noOfPages,
            noOfItemsInCurrentPage: pageArr.value.length,
            firstItemNo: (meta.value.pageNoB1 - 1) * ipp + 1,
            lastItemNo: (meta.value.pageNoB1 - 1) * ipp + pageArr.value.length,
            length: meta.value.length
        }
    }

    function setArray(name: TCollectionName, data: TApiArrayItemMain[]) {
        let array = getCollectionArray(name)
        let meta = getCollectionMeta(name)
        array.value = data
        meta.value.length = data.length
    }

    async function loadPage(name: TCollectionName, pageNoB1: number, view: TCollectionViews, module: TModule): Promise<boolean> {
        let meta = getCollectionMeta(name)
        let ipp = getIpp(view)
        let start = (pageNoB1 - 1) * ipp;
        let array = getCollectionArray(name)
        let ids = array.value.slice(start, start + ipp).map(x => x.id);

        console.log(`loadPage() source: ${name}  module: ${module} view: ${view} pageB1: ${pageNoB1}  ipp: ${ipp} startIndex: ${start} endIndex: ${start + ipp - 1}`);

        switch (name) {
            case 'main':
                if (view === 'Chip') {
                    savePage('main', array.value.slice(start, start + ipp), view, module)
                    meta.value.pageNoB1 = pageNoB1
                    meta.value.viewIndex = meta.value.views.indexOf(view)
                    return true
                }

                if (ids.length === 0) {
                    //console.log(`ids.length is 0 - returning`)
                    savePage('main', [], view, module)
                    return true
                }

                await send('model/page', 'post', { model: module, view: view, ids })
                    .then(res => {
                        console.log(`model.page() returned (success)`)
                        savePage('main', res.data.page, view, module)
                        meta.value.pageNoB1 = pageNoB1
                        meta.value.viewIndex = meta.value.views.indexOf(view)
                        return true
                    })
                    .catch(err => {
                        showSnackbar(`loadPage failed - Navigation cancelled`)
                        console.log(`loadPage failed. err: ${JSON.stringify(err, null, 2)}`)
                        return false
                    })
                    .finally(() => {
                        console.log(`model.page() finally`)
                        return true
                    })
                break
            case 'media':
                savePage('media', array.value.slice(start, start + ipp), view, module)

            default:
                return false

        }
        return true
    }

    function savePage(name: TCollectionName, page: TApiPageItem[], view: TCollectionViews, module: TModule): void {
        let toSave = []
        let pageRef = getPageArray(name)
        switch (name) {
            case 'main':
                switch (view) {
                    case 'Image':

                        toSave = (<TApiMainImage[]>page).map(x => {
                            const media = buildMedia(x.media1, module)
                            const item = { id: x.id, url_id: x.url_id, tag: x.url_id, description: x.description }
                            return { ...item, media: media }
                        })
                        pageRef.value = <TPageCMainVImage[]>toSave
                        break;

                    case 'Chip':
                        toSave = (<TApiArrayItemMain[]>page).map(x => { return { id: x.id, url_id: x.url_id, tag: x.url_id } })
                        pageRef.value = <TPageVChip[]>toSave
                        break;

                    case 'Table':
                        toSave = (<TApiMainTable[]>page).map(x => { return { id: x.id, url_id: x.url_id, tag: x.url_id, description: x.description } })
                        pageRef.value = <TPageCMainVTable[]>toSave
                        break;
                }
                break
            case 'media':
                toSave = (<TApiMedia[]>page).map(x => {
                    const media = buildMedia({ full: x.full, tn: x?.tn }, module)
                    const item = { id: x.id, tag: "my tag", description: x.description }
                    return { ...item, media: media }
                })
                pageRef.value = <TPageCMediaVImage[]>toSave
                break;

            case 'related':
        }
        //console.log(`Saving page: ${JSON.stringify(toSave, null, 2)}`)
    }

    async function toggleCollectionView(name: TCollectionName) {
        let { getModule } = useRoutesMainStore()
        let module = getModule()
        let meta = collectionMeta(name)
        let currentView = meta.views[meta.viewIndex]
        let newViewIndex = (meta.viewIndex + 1) % meta.views.length
        let newView = meta.views[newViewIndex]
        let index = meta.firstItemNo - 1
        console.log(`toggleCollectionView() collection: ${name}  module: ${module} views: ${meta.views}  current view: ${currentView}  new view: ${newView} index: ${index}` );
        //await loadPage(name, 1, newView, module)
        await loadPageByItemIndex(name, newView, index, module)
    }

    function setItemsPerPage(ipp: TItemPerPagePerView) {
        itemsPerPagePerView.value['Image'] = ipp["Image"]
        itemsPerPagePerView.value['Chip'] = ipp["Chip"]
        itemsPerPagePerView.value['Table'] = ipp["Table"]
    }

    async function loadPageByItemIndex(collectionName: TCollectionName, view: TCollectionViews,  index: number, module: TModule,) {
        let meta = collectionMeta(collectionName)
        let ipp = getIpp(view)
        let pageNoB0 = Math.floor(index / ipp)
        console.log(`loadPageByItemIndex() collectionName: ${collectionName} view: ${view} index: ${index} module: ${module}`)
        await loadPage(collectionName, pageNoB0 + 1, view, module)
    }

    function itemIndexById(id: number) {
        let index = mainArray.value.findIndex(x => x.id === id)
        //console.log(`itemIndexById(id:${id}) index: ${index}`)
        return index

    }

    function itemIsInPage(id: number) {
        return mainPageArray.value.some((x) => (<TPageCMainVImage>x).id === id)
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

    function clearCollections() {
        mainArray.value = []
        mainPageArray.value = []
        main.value.viewIndex = 0
        main.value.pageNoB1 = 1

        mediaArray.value = []
        mediaPageArray.value = []
        media.value.viewIndex = 0
        media.value.pageNoB1 = 1

        relatedArray.value = []
        relatedPageArray.value = []
        related.value.viewIndex = 0
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
        media,
        mediaArray,
        mediaPageArray,
        itemIdsByIndex,
        setItemsPerPage,
        collectionMeta,
        setArray,
        loadPage,
        toggleCollectionView,
        clearCollections,
        getPageArray,
        itemIndexById,
        loadPageByItemIndex,
        itemIsInPage,
        firstUrlId
    }
})