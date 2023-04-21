// collection.ts
//handles all collections and loading of pages
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TCollectionName, TCollectionView, TCollectionMeta, } from '../../../types/collectionTypes'
import { TModule } from '../../../types/routesTypes'
import { TItemPerPagePerView, TApiArrayItemMain, } from '@/js/types/apiTypes'
import { useRoutesMainStore } from '../routes/routesMain'
import { useXhrStore } from '../xhr'
import { useNotificationsStore } from '../notifications'
import { useCollectionMainStore } from './collectionMain'

export const useCollectionsStore = defineStore('collections', () => {


    let itemsPerPagePerView = ref({
        Image: 0,
        Chip: 0,
        Table: 0
    })

    function getIpp(view: TCollectionView): number {
        return itemsPerPagePerView.value[view]
    }

    function setItemsPerPage(ipp: TItemPerPagePerView) {
        itemsPerPagePerView.value['Image'] = ipp["Image"]
        itemsPerPagePerView.value['Chip'] = ipp["Chip"]
        itemsPerPagePerView.value['Table'] = ipp["Table"]
    }

    function getCollection(source: TCollectionName) {
        switch (source) {
            case 'main':
                return useCollectionMainStore()
            case 'related':
                return useCollectionMainStore()
            case 'media':
                return useCollectionMainStore()
        }
    }

    function collectionMeta(name: TCollectionName): TCollectionMeta {
        let c = getCollection(name)
        let extra = c.extra
        let page = c.page

        //console.log(`collectionMeta("${name}")`)
        let view = extra.views[extra.viewIndex]
        let ipp = getIpp(view)
        let noOfPages = Math.floor(extra.length / ipp) + (extra.length % ipp === 0 ? 0 : 1)

        return {
            views: extra.views,//.map(x => ECollectionViews[x]),
            viewIndex: extra.viewIndex,
            view: view,
            itemsPerPage: ipp,
            pageNoB1: extra.pageNoB1,
            noOfItems: extra.length,
            noOfPages,
            noOfItemsInCurrentPage: page.length,
            firstItemNo: (extra.pageNoB1 - 1) * ipp + 1,
            lastItemNo: (extra.pageNoB1 - 1) * ipp + page.length,
            length: extra.length
        }
    }

    function setArray(name: TCollectionName, data: TApiArrayItemMain[]) {
        let c = getCollection(name)
        c.setArray(data)
    }

    async function loadPage(name: TCollectionName, pageNoB1: number, view: TCollectionView, module: TModule): Promise<boolean> {
        let ipp = getIpp(view)
        let start = (pageNoB1 - 1) * ipp;

        console.log(`loadPage() source: ${name}  module: ${module} view: ${view} pageB1: ${pageNoB1}  ipp: ${ipp} startIndex: ${start} endIndex: ${start + ipp - 1}`);

        let c = getCollection(name)
        await c.loadPage(pageNoB1, view, module)
        return true
    }

    async function loadPageByItemIndex(collectionName: TCollectionName, view: TCollectionView, index: number, module: TModule,) {
        let ipp = getIpp(view)
        let pageNoB0 = Math.floor(index / ipp)
        console.log(`loadPageByItemIndex() collectionName: ${collectionName} view: ${view} index: ${index} module: ${module}`)
        await loadPage(collectionName, pageNoB0 + 1, view, module)

        let c = getCollection(collectionName)
        await c.loadPage(pageNoB0 + 1, view, module)
    }

    async function toggleCollectionView(name: TCollectionName) {
        let { getModule } = useRoutesMainStore()
        let module = getModule()
        let meta = collectionMeta(name)
        let currentView = meta.views[meta.viewIndex]
        let newViewIndex = (meta.viewIndex + 1) % meta.views.length
        let newView = meta.views[newViewIndex]
        let index = meta.firstItemNo - 1
        console.log(`toggleCollectionView() collection: ${name}  module: ${module} views: ${meta.views}  current view: ${currentView}  new view: ${newView} index: ${index}`);
        await loadPageByItemIndex(name, newView, index, module)
    }

    function itemIndexById(id: number) {
        let c = getCollection('main')
        return c.itemIndexById(id)
    }

    function itemIsInPage(id: number) {
        let c = getCollection('main')
        return c.itemIsInPage(id)
    }

    function itemIdsByIndex(name: TCollectionName, index: number) {
        let c = getCollection(name)
        return c.itemByIndex(index)
    }

    function clearCollections() {
        let collections = ['main', 'media', 'related']
        collections.forEach(x => {
            let c = getCollection(<TCollectionName>x)
            return c.clear()
        })
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

    const mainCollection = computed(() => {
        let c = getCollection('main')
        return {
            array: c.array,
            page: c.page,
            meta: collectionMeta('main')
        }
    })

    const mediaCollection = computed(() => {
        let c = getCollection('media')
        return {
            array: c.array,
            page: c.page,
            meta: collectionMeta('media')
        }
    })

    const relatedCollection = computed(() => {
        let c = getCollection('related')
        return {
            array: c.array,
            page: c.page,
            meta: collectionMeta('related')
        }
    })

    function collection(name: TCollectionName) {
        switch (name) {
            case 'main':
                return mainCollection
            case 'related':
                return relatedCollection
            case 'media':
                return mediaCollection
        }
    }

    // mainCollection, mediaCollection, main and media for debug only.
    //Note : computed collection will only e reactive only if state (main, media) is exposed.
    return {
        getIpp,
        collection,
        mainCollection,
        mediaCollection,
        itemIdsByIndex,
        setItemsPerPage,
        setArray,
        loadPage,
        toggleCollectionView,
        clearCollections,
        itemIndexById,
        loadPageByItemIndex,
        itemIsInPage,
        firstUrlId
    }
})