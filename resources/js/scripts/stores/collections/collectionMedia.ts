// collection.ts
//handles all collections and loading of pages
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TModule } from '../../../types/routesTypes'
import { TMediaRecord } from '../../../types/mediaTypes'
import { TPageCMediaVImage, TCollectionExtra, TCollectionView, TApiArray } from '@/js/types/collectionTypes'
import { useCollectionsStore } from './collections'
import { useMediaStore } from '../media'

export const useCollectionMediaStore = defineStore('collectionMedia', () => {
    const { buildMedia } = useMediaStore()
    const c = useCollectionsStore()

    let extra = ref<TCollectionExtra>({
        length: 0,
        pageNoB1: 1,
        views: ['Image'],
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

    const page = computed<TPageCMediaVImage[]>(() => {
        let ipp = c.getIpp('Image')
        let start = ( extra.value.pageNoB1 - 1) * ipp
        let slice = array.value.slice(start, start + ipp)
        let res = slice.map(x => { return {id: x.id, media: buildMedia({full: x.full, tn: x.tn}), tag: "tag",description: "LLLLL",}})
        return res
    })
    function setArray(data: TApiArray[]) {
        array.value = <TMediaRecord[]>data
        extra.value.length = data.length
    }

    async function loadPage(pageNoB1: number, view: TCollectionView, module: TModule): Promise<boolean> {
        let ipp = c.getIpp(view)
        let start = (pageNoB1 - 1) * ipp

        console.log(`collectionMedia.loadPage() view: ${view} pageB1: ${pageNoB1}  ipp: ${ipp} startIndex: ${start} endIndex: ${start + ipp - 1} module: ${module} `);
        extra.value.pageNoB1 = pageNoB1
        extra.value.viewIndex = extra.value.views.indexOf(view)
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
        extra.value.viewIndex = 0
        extra.value.pageNoB1 = 1
        extra.value.length = 0
    }

    return {
        extra,
        array,
        page,
        loadPage,
        itemIndexById,
        setArray,
        collection,
        itemIsInPage,
        itemByIndex,
        clear,
    }
})