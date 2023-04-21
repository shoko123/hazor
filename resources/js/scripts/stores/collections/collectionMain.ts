// collection.ts
//handles all collections and loading of pages
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TCollectionExtra, TCollectionName, TElement, TItemsPerPage, TPageItem, TCollectionView, TPageCMainVImage, TPageCMainVTable, TPageVChip } from '../../../types/collectionTypes'
import { TMedia } from '../../../types/mediaTypes'

import { TModule } from '../../../types/routesTypes'
import { TApiMedia, TApiMediaOrNull, TItemPerPagePerView, TApiArrayItemMain, TApiMainImage, TApiMainTable, TApiPageItem } from '@/js/types/apiTypes'
import { useCollectionsStore } from './collections'
import { useRoutesMainStore } from '../routes/routesMain'
import { useXhrStore } from '../xhr'
import { useMediaStore } from '../media'
import { useNotificationsStore } from '../notifications'

export const useCollectionMainStore = defineStore('collectionMain', () => {
    const { send } = useXhrStore()
    const { showSnackbar } = useNotificationsStore()
    const { buildMedia } = useMediaStore()
    const c = useCollectionsStore()

    let extra = ref<TCollectionExtra>({
        length: 0,
        pageNoB1: 1,
        views: ['Image', 'Chip', 'Table'],
        viewIndex: 0,
    })

    let array = ref<TApiArrayItemMain[]>([])

    let page = ref<TApiPageItem[]>([])

    const computedChipPage = computed(() => {

        let ex = extra.value
        if (ex.length === 0) {
            return []
        }
        let ipp = c.getIpp('Chip')
        let start = (ex.pageNoB1 - 1) * ipp


        let slice = array.value.slice(start, start + ipp)
        return slice.map(x => {
            let m = { ...x }
            return { ...m, tag: x.url_id }
        })


    })
    const computedPage = computed(() => {
        return extra.value.views[extra.value.viewIndex] === 'Chip' ? computedChipPage.value : page.value
    })

    const collection = computed(() => {
        return {
            array: array.value,
            page: computedPage.value,
            extra: extra.value
        }
    })

    function setArray(data: TApiArrayItemMain[]) {
        array.value = data
        extra.value.length = data.length
    }




    async function loadPage(pageNoB1: number, view: TCollectionView, module: TModule): Promise<boolean> {
        let ipp = c.getIpp(view)
        let start = (pageNoB1 - 1) * ipp

        console.log(`collectionMain.loadPage() view: ${view} pageB1: ${pageNoB1}  ipp: ${ipp} startIndex: ${start} endIndex: ${start + ipp - 1} module: ${module} `);

        switch (view) {
            //if 'Chip' do nothing - page will be extracted from array
            case 'Chip':
                //savePage(array.value.slice(start, start + ipp), view, module)
                extra.value.pageNoB1 = pageNoB1
                extra.value.viewIndex = extra.value.views.indexOf(view)
                page.value = []
                return true

            case 'Image':
            case 'Table':

                let ids = array.value.slice(start, start + ipp).map(x => x.id);


                if (ids.length === 0) {
                    console.log(`ids.length is 0 - returning`)
                    savePage([], view, module)
                    return true
                }



                await send('model/page', 'post', { model: module, view: view, ids })
                    .then(res => {
                        console.log(`model.page() returned (success)`)
                        savePage(res.data.page, view, module)
                        extra.value.pageNoB1 = pageNoB1
                        extra.value.viewIndex = extra.value.views.indexOf(view)
                        return true
                    })
                    .catch(err => {
                        showSnackbar(`main.loadPage() failed`)
                        console.log(`loadPage failed. err: ${JSON.stringify(err, null, 2)}`)
                        return false
                    })
                    .finally(() => {
                        console.log(`main.loadPage() finally`)
                        return true
                    })
                return true
        }
    }

    function savePage(apiPage: TApiPageItem[], view: TCollectionView, module: TModule): void {
        let toSave = []
        let pageRef = <TPageItem[]>([])

        switch (view) {
            case 'Image':

                toSave = (<TApiMainImage[]>apiPage).map(x => {
                    const media = buildMedia(x.media1, module)
                    const item = { id: x.id, url_id: x.url_id, tag: x.url_id, description: x.description }
                    return { ...item, media: media }
                })
                page.value = <TPageCMainVImage[]>toSave
                break;



            case 'Table':
                toSave = (<TApiMainTable[]>apiPage).map(x => { return { id: x.id, url_id: x.url_id, tag: x.url_id, description: x.description } })
                page.value = <TPageCMainVTable[]>toSave
                break;
        }
        //console.log(`Saving page: ${JSON.stringify(toSave, null, 2)}`)
    }

    // async function loadPageByItemIndex(view: TCollectionView, index: number, module: TModule,) {
    //     let ipp = c.getIpp(view)
    //     let pageNoB0 = Math.floor(index / ipp)
    //     console.log(`main.loadPageByItemIndex() view: ${view} index: ${index} module: ${module}`)
    //     await loadPage(pageNoB0 + 1, view, module)
    // }

    function itemIndexById(id: number) {
        let index = array.value.findIndex(x => x.id === id)
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
        computedChipPage
    }
})