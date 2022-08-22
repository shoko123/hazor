// collection.ts
//handles all collections and loading of chunks (pages)
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed, registerRuntimeCompiler } from 'vue'
import { TCollection, TSource, TElement, TItemsPerPage, TView, TArrayItem, IPageMediaItem, IPageTableItem } from '../../types/collectionTypes'
import { useXhrStore } from './xhr'
import { useRoutesStore } from './routes/routesMain'

export const useCollectionsStore = defineStore('collections', () => {
    const { send } = useXhrStore()
    const { to } = storeToRefs(useRoutesStore())
    const itemsPerPage = ref<TItemsPerPage>({
        Media: 0,
        Chips: 0,
        Table: 0,
    })

    let main = ref<TCollection>({
        array: [],
        index: 0,
        page: [],
        views: ["Media", "Chips", "Table"],
        viewIndex: 0,
        ready: { array: false, index: false, page: false }
    })

    const media = ref<TCollection>({
        array: [],
        index: 0,
        page: [],
        views: ["Media"],
        viewIndex: 0,
        ready: { array: false, index: false, page: false }
    })

    const related = ref<TCollection>({
        array: [],
        index: 0,
        page: [],
        views: ["Media", "Chips"],
        viewIndex: 0,
        ready: { array: false, index: false, page: false }
    })

    const collectionMain = computed(() => {
        return main
    })

    function setItemsPerPage(ipp: TItemsPerPage) {
        itemsPerPage.value = ipp
    }

    function getCollection(name: TSource) {
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
                setViewIndex(name, data)
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
                alert('Bad array name')
        }
    }

    async function setPage(name: TSource, pageB1: number) {

        switch (name) {
            case 'main':
                let view = main.value.views[main.value.viewIndex]
                let ipp = itemsPerPage.value[view]
                let start = (pageB1.valueOf() - 1) * ipp;
                let ids = main.value.array.slice(start, start + ipp).map(x => x.id);
                console.log(`setPage() pageB1: ${pageB1} start: ${start} ipp: ${ipp}`);

                await send('model/page', 'post', { model: to.value.module, view, ids })
                    .then(res => {
                        console.log(`page() returned (success)`)
                        //console.log(`index() returned res: ${JSON.stringify(res, null, 2)}`)
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
                        // n.showSpinner(false)
                    })
        }
    }

    function setViewIndex(name: TSource, data: any) {
        switch (name) {
            case 'main':
                main.value.viewIndex = data
                break
            case 'media':
                media.value.viewIndex = data
                break
            case 'related':
                related.value.viewIndex = data
                break
            default:
                alert('Bad array name')
        }
    }

    function reset() {
        let sources: TSource[] = ['main', 'media', 'related']
        sources.forEach(x => {
            setPage(x, 0)
            setArray(x, [])
            setViewIndex(x, 0)
        })
    }
    return { itemsPerPage, main, related, media, getCollection, collectionMain, setCollectionElement, reset }
})