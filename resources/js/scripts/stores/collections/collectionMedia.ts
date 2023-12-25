// collection.ts
//handles all collections and loading of pages
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TModule } from '../../../types/routesTypes'
import { TMediaRecord, TPageCMedia } from '../../../types/mediaTypes'
import { TCollectionExtra, TCView, TApiArray, TCollectionView } from '@/js/types/collectionTypes'
import { useCollectionsStore } from './collections'
import { useMediaStore } from '../media'

export const useCollectionMediaStore = defineStore('collectionMedia', () => {
    const { buildMedia } = useMediaStore()
    const c = useCollectionsStore()

    let extra = ref<TCollectionExtra>({
        length: 0,
        pageNoB1: 1,
        views: [{name: 'Image', ipp: 36}],
        viewIndex: 0,
    })

    let array = ref<TMediaRecord[]>([])

    const collection = computed(() => {
        return {
            array: array.value,
            page: page.value,
            extra: extra.value
        }
    })

    const ipp = computed(() => {
        return  extra.value.views[extra.value.viewIndex].ipp     
    })

    const page = computed<TPageCMedia[]>(() => {
        //let ipp = c.getIpp('Image')
        let start = (extra.value.pageNoB1 - 1) * ipp.value
        let slice = array.value.slice(start, start + ipp.value)
        let res = slice.map(x => {
            let media = buildMedia({ full: x.urls.full, tn: x.urls.tn })
            return {
                id: x.id,
                urls: {
                    full: media.urls.full,
                    tn: media.urls.tn
                },
                size: x.size,
                collection_name: x.collection_name,
                file_name: x.file_name,
                order_column: x.order_column,
                title: "LLLLL",
                text: "LLLLL",
            }
        })
        return res
    })

    function setArray(data: TApiArray[]) {
        array.value = <TMediaRecord[]>data
        extra.value.length = data.length
    }

    function setCollectionViews(views: TCollectionView[]){
        //media collection views are constant (not dependent on Module - do nothing.
        //extra.value.views = views.map(x => { return { name: x, ipp: itemsPerView[x] } })
    }
    function switchArrayItems(indexA: number, indexB: number) {
        let temp = { ...array.value[indexA] }
        array.value[indexA] = { ...array.value[indexB] }
        array.value[indexB] = { ...temp }
    }

    async function loadPage(pageNoB1: number, view: TCView, module: TModule): Promise<boolean> {
        let ipp = view.ipp
        let start = (pageNoB1 - 1) * ipp

        //console.log(`collectionMedia.loadPage() view: ${view} pageB1: ${pageNoB1}  ipp: ${ipp} startIndex: ${start} endIndex: ${start + ipp - 1} module: ${module} `);
        extra.value.pageNoB1 = pageNoB1
        //extra.value.viewIndex = viewIndex
        //extra.value.viewIndex = extra.value.views.indexOf(view)
        return true

    }

    function itemIndexById(id: number) {
        let index = array.value.findIndex(x => x["id"] === id)
        //console.log(`itemIndexById(id:${id}) index: ${index}`)
        return index

    }

    function itemIsInPage(id: number) {
        return page.value.some((x) => x.id === id)
    }

    function itemByIndex(index: number): TMediaRecord {
        return array.value[index]
    }

    function clear() {
        array.value = []
        extra.value.pageNoB1 = 1
        extra.value.length = 0
    }

    return {
        extra,
        ipp,
        array,
        page,
        loadPage,
        itemIndexById,
        setCollectionViews,
        setArray,
        switchArrayItems,        
        collection,
        itemIsInPage,
        itemByIndex,
        clear,
    }
})