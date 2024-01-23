// collection.ts
//handles all collections and loading of pages
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TModule } from '../../../types/routesTypes'
import { TCollectionExtra, TCView, TApiArrayMedia, TApiArray, TCollectionView, TPageMediaGallery } from '@/js/types/collectionTypes'
import { useCollectionsStore } from './collections'
import { useMediaStore } from '../media'

export const useCollectionMediaStore = defineStore('collectionMedia', () => {
    const { buildMedia } = useMediaStore()
    const c = useCollectionsStore()

    const extra = ref<TCollectionExtra>({
        length: 0,
        pageNoB1: 1,
        views: [{ name: 'Gallery', ipp: 36 }],
        viewIndex: 0,
    })

    const array = ref<TApiArrayMedia[]>([])

    const collection = computed(() => {
        return {
            array: array.value,
            page: page.value,
            extra: extra.value
        }
    })

    const ipp = computed(() => {
        return extra.value.views[extra.value.viewIndex].ipp
    })

    const page = computed<TPageMediaGallery[]>(() => {
        const start = (extra.value.pageNoB1 - 1) * ipp.value
        const slice = array.value.slice(start, start + ipp.value)
        const res = slice.map(x => {
            const media = buildMedia({ full: x.urls.full, tn: x.urls.tn })
            return {
                id: x.id,
                order_column: x.order_column,
                urls: media.urls,
            }
        })
        return res
    })

    function setArray(data: TApiArray[]) {
        array.value = <TApiArrayMedia[]>data
        extra.value.length = data.length
    }

    function setCollectionViews(views: TCollectionView[]) {
        //The media collection has only one view (Gallery) independent of module. So, do nothing.
    }

    function switchArrayItems(indexA: number, indexB: number) {
        const temp = { ...array.value[indexA] }
        array.value[indexA] = { ...array.value[indexB] }
        array.value[indexB] = { ...temp }
    }

    async function loadPage(pageNoB1: number, view: TCView, module: TModule): Promise<boolean> {
        const ipp = view.ipp
        const start = (pageNoB1 - 1) * ipp

        //console.log(`collectionMedia.loadPage() view: ${view} pageB1: ${pageNoB1}  ipp: ${ipp} startIndex: ${start} endIndex: ${start + ipp - 1} module: ${module} `);
        extra.value.pageNoB1 = pageNoB1
        //extra.value.viewIndex = viewIndex
        //extra.value.viewIndex = extra.value.views.indexOf(view)
        return true

    }

    function itemIndexById(id: number) {
        const index = array.value.findIndex(x => x["id"] === id)
        //console.log(`itemIndexById(id:${id}) index: ${index}`)
        return index

    }

    function itemIsInPage(id: number) {
        return page.value.some((x) => x.id === id)
    }

    function itemByIndex(index: number): TApiArrayMedia {
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