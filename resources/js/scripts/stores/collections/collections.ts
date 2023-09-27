// collection.ts
//handles all collections and loading of pages
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TCollectionName, TCollectionMeta, TApiArray, TCView } from '@/js/types/collectionTypes'
import { TModule } from '../../../types/routesTypes'
import { useXhrStore } from '../xhr'
import { useRoutesMainStore } from '../routes/routesMain'
import { useNotificationsStore } from '../notifications'
import { useCollectionMainStore } from './collectionMain'
import { useCollectionMediaStore } from './collectionMedia'
import { useCollectionRelatedStore } from './collectionRelated'

export const useCollectionsStore = defineStore('collections', () => {
    function getCollection(source: TCollectionName) {
        switch (source) {
            case 'main':
                return useCollectionMainStore()

            case 'media':
                return useCollectionMediaStore()
            case 'related':
                return useCollectionRelatedStore()
        }
    }

    function collectionMeta(name: TCollectionName): TCollectionMeta {
        let c = getCollection(name)
        let extra = c.extra
        let page = c.page

        //console.log(`collectionMeta("${name}")`)
        let view = extra.views[extra.viewIndex]
        let ipp = c.ipp //getIpp(view)
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

    function setArray(name: TCollectionName, data: TApiArray[]) {
        let c = getCollection(name)
        c.setArray(data)
    }

    async function loadPage(name: TCollectionName, pageNoB1: number, view: TCView, module: TModule): Promise<boolean> {
        //console.log(`loadPage() source: ${name}  module: ${module} view: ${view} pageB1: ${pageNoB1}  ipp: ${ipp} startIndex: ${start} endIndex: ${start + ipp - 1}`);

        let c = getCollection(name)
        await c.loadPage(pageNoB1, view, module)
        return true
    }

    async function loadPageByItemIndex(collectionName: TCollectionName, view: TCView, index: number, module: TModule,) {
        let ipp = view.ipp
        let pageNoB0 = Math.floor(index / ipp)
        //console.log(`loadPageByItemIndex() collectionName: ${collectionName} view: ${view} index: ${index} module: ${module}`)
        await loadPage(collectionName, pageNoB0 + 1, view, module)
    }

    async function toggleCollectionView(name: TCollectionName) {
        let { getModule } = useRoutesMainStore()
        let module = getModule()
        let meta = collectionMeta(name)
        let currentView = meta.views[meta.viewIndex]
        let newViewIndex = (meta.viewIndex + 1) % meta.views.length
        let newView = meta.views[newViewIndex]
        let index = meta.firstItemNo - 1
        console.log(`toggleCollectionView() collection: ${name}  module: ${module} views: ${meta.itemsPerPage}  current view: ${currentView.name}  new view: ${newView.name} index: ${index}`);
        await loadPageByItemIndex(name, newView, index, module)
        let c = getCollection(name)
        c.extra.viewIndex = newViewIndex
    }

    function itemIndexById(id: number) {
        let c = getCollection('main')
        return c.itemIndexById(id)
    }

    function itemIsInPage(id: number) {
        let c = getCollection('main')
        return c.itemIsInPage(id)
    }

    function itemByIndex(name: TCollectionName, index: number): TApiArray {
        let c = getCollection(name)
        return c.itemByIndex(index)
    }

    function next(name: TCollectionName, index: number, isRight: boolean): { item: TApiArray, index: number } {
        let c = getCollection(name)
        let length = c.collection.extra.length
        let newIndex

        if (isRight) {
            newIndex = (index === length - 1) ? 0 : index + 1
        } else {
            newIndex = (index === 0) ? length - 1 : index - 1
        }
        return { item: c.array[newIndex], index: newIndex }
    }

    function clear(collections: TCollectionName[]) {
        collections.forEach(x => {
            let c = getCollection(<TCollectionName>x)
            return c.clear()
        })
    }

    async function firstSlug() {
        let xhr = useXhrStore();
        let n = useNotificationsStore();
        let { current } = useRoutesMainStore()

        console.log(`firstSlug model: ${current.module}`)
        n.showSpinner(`Finding first item ...`)
        return xhr.send('model/firstSlug', 'post', { model: current.module })
            .then(res => {
                console.log(`firstSlug() returned ${res.data.slug}`)
                //console.log(`show() returned (success). res: ${JSON.stringify(res, null, 2)}`)
                return res.data.slug
            })
            .catch(err => {
                console.log(`firstSlug() failed`)
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
        collection,
        itemByIndex,
        setArray,
        loadPage,
        toggleCollectionView,
        clear,
        itemIndexById,
        loadPageByItemIndex,
        itemIsInPage,
        next,
        firstSlug
    }
})