// collection.ts
//handles all collections and loading of pages
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TModule } from '../../../types/routesTypes'
import { TCollectionExtra, TCollectionView, TPageCMainVImage, TApiArrayRelated, TApiArray, TPageCRelatedVMedia } from '@/js/types/collectionTypes'
import { useCollectionsStore } from './collections'
import { useRoutesMainStore } from '../routes/routesMain'
import { useXhrStore } from '../xhr'
import { useMediaStore } from '../media'
import { useNotificationsStore } from '../notifications'
import { useModuleStore } from '../module'

export const useCollectionRelatedStore = defineStore('collectionRelated', () => {
    const { send } = useXhrStore()
    const { showSnackbar } = useNotificationsStore()
    const { buildMedia } = useMediaStore()
    const c = useCollectionsStore()
    const { tagFromSlug } = useModuleStore() 
    let extra = ref<TCollectionExtra>({
        length: 0,
        pageNoB1: 1,
        views: ['Image'],
        viewIndex: 0,
    })

    let array = ref<TApiArrayRelated[]>([])

    const page = computed<TPageCRelatedVMedia[]>(() => {
        let ipp = c.getIpp('Image')
        let start = (extra.value.pageNoB1 - 1) * ipp
        let slice = array.value.slice(start, start + ipp)
        let res = slice.map(x => {
            let media = buildMedia(x.media, x.module)
            return {
                relation_name: x.relation_name,
                module: x.module,
                id: x.id,
                slug: x.slug,
                tag: tagFromSlug(x.module, x.slug),
                short: x.short,
                media
            }
        })
        return res
    })

    const collection = computed(() => {
        return {
            array: array.value,
            page: page.value,//computedPage.value,
            extra: extra.value
        }
    })

    function setArray(data: TApiArray[]) {
        array.value = <TApiArrayRelated[]>data
        extra.value.length = data.length
    }

    async function loadPage(pageNoB1: number, view: TCollectionView, module: TModule): Promise<boolean> {
        let ipp = c.getIpp(view)
        let start = (pageNoB1 - 1) * ipp

        console.log(`collectionRelated.loadPage() view: ${view} pageB1: ${pageNoB1}  ipp: ${ipp} startIndex: ${start} endIndex: ${start + ipp - 1} module: ${module} `);

        //savePage(array.value.slice(start, start + ipp), view, module)
        extra.value.pageNoB1 = pageNoB1
        extra.value.viewIndex = extra.value.views.indexOf(view)
        return true
    }

    function itemIndexById(id: number) {
        let index = array.value.findIndex(x => x.id === id)
        return index
    }

    function itemIsInPage(id: number) {
        return page.value.some((x) => (<TPageCMainVImage>x).id === id)
    }

    function itemByIndex(index: number): TApiArray {
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
        itemIndexById,
        setArray,
        collection,
        itemIsInPage,
        itemByIndex,
        clear,
    }
})