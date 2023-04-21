// collection.ts
//handles all collections and loading of pages
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TCollectionExtra, TCollectionName, TElement, TItemsPerPage, TPageItem, TCollectionView, TPageCMainVImage, TPageCMainVTable, TPageVChip } from '../../../types/collectionTypes'
import { TMedia } from '../../../types/mediaTypes'

import { TModule } from '../../../types/routesTypes'
import { TApiPageMedia, TItemPerPagePerView, TApiArrayMedia, TApiPageMainImage, TApiPageMainTable, TApiArray, TApiPage } from '@/js/types/apiTypes'
import { useCollectionsStore } from './collections'
import { useRoutesMainStore } from '../routes/routesMain'
import { useXhrStore } from '../xhr'
import { useMediaStore } from '../media'
import { useNotificationsStore } from '../notifications'

export const useCollectionRelatedStore = defineStore('collectionRelated', () => {
    const { send } = useXhrStore()
    const { showSnackbar } = useNotificationsStore()
    const { buildMedia } = useMediaStore()
    const c = useCollectionsStore()

    let extra = ref<TCollectionExtra>({
        length: 0,
        pageNoB1: 1,
        views: ['Image'],
        viewIndex: 0,
    })

    let array = ref<TApiArrayMedia[]>([])

    let page = ref<TApiPage[]>([])

    const collection = computed(() => {
        return {
            array: array.value,
            page: page.value,//computedPage.value,
            extra: extra.value
        }
    })

    function setArray(data: TApiArray[]) {
        array.value = <TApiArrayMedia[]>data
        extra.value.length = data.length
    }

    async function loadPage(pageNoB1: number, view: TCollectionView, module: TModule): Promise<boolean> {
        let ipp = c.getIpp(view)
        let start = (pageNoB1 - 1) * ipp

        console.log(`collectionMedia.loadPage() view: ${view} pageB1: ${pageNoB1}  ipp: ${ipp} startIndex: ${start} endIndex: ${start + ipp - 1} module: ${module} `);

       
                //savePage(array.value.slice(start, start + ipp), view, module)
                extra.value.pageNoB1 = pageNoB1
                extra.value.viewIndex = extra.value.views.indexOf(view)
                let slice = array.value.slice(start, start + ipp)
               
                savePage(slice, module)              
                return true


    }

    function savePage(apiPage: TApiArrayMedia[], module: TModule) {
        let toSave = []
        let pageRef = <TPageItem[]>([])

      

                toSave = (<TApiPageMedia[]>apiPage).map(x => {
                    const media = buildMedia(x, module)
                    const item = { id: x?.id, description: x.description }
                    return { ...item, media: media }
                })
                page.value = <TPageCMainVImage[]>toSave
             
        //console.log(`Saving page: ${JSON.stringify(toSave, null, 2)}`)
    }



    function itemIndexById(id: number) {
        let index = array.value.findIndex(x => x?.id === id)
        //console.log(`itemIndexById(id:${id}) index: ${index}`)
        return index

    }

    function itemIsInPage(id: number) {
        return page.value.some((x) => (<TPageCMainVImage>x).id === id)
    }

    function itemByIndex(index: number) {
        return array.value[index]

    }

    function clear() {
        array.value = []
        page.value = []
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