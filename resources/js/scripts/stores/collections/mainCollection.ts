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

export const useMainCollectionStore = defineStore('mainCollection', () => {
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

    let page = ref<TPageItem[]>([])

    const collection = computed(() => {
        return {
            array: array.value,
            page: page.value,
            extra: extra.value
        }
    })






    async function loadPage(name: TCollectionName, pageNoB1: number, view: TCollectionView, module: TModule): Promise<boolean> {
        let ipp = c.getIpp(view)
        let start = (pageNoB1 - 1) * ipp

        console.log(`loadPage() source: ${name}  module: ${module} view: ${view} pageB1: ${pageNoB1}  ipp: ${ipp} startIndex: ${start} endIndex: ${start + ipp - 1}`);

        let ids = array.value.slice(start, start + ipp).map(x => x.id);
        if (ids.length === 0) {
            //console.log(`ids.length is 0 - returning`)
            savePage('main', [], view, module)
            return true
        }


        switch (view) {
            case 'Chip':
                savePage('main', array.value.slice(start, start + ipp), view, module)
                extra.value.pageNoB1 = pageNoB1
                extra.value.viewIndex = extra.value.views.indexOf(view)
                return true

            case 'Image':
            case 'Table':


             

                await send('model/page', 'post', { model: module, view: view, ids })
                    .then(res => {
                        console.log(`model.page() returned (success)`)
                        savePage('main', res.data.page, view, module)
                        extra.value.pageNoB1 = pageNoB1
                        extra.value.viewIndex = extra.value.views.indexOf(view)
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


                return true
        }
    }

    function savePage(name: TCollectionName, page: TApiPageItem[], view: TCollectionView, module: TModule): void {
        let toSave = []
        let pageRef = <TPageItem[]>([])
      
                switch (view) {
                    case 'Image':

                        toSave = (<TApiMainImage[]>page).map(x => {
                            const media = buildMedia(x.media1, module)
                            const item = { id: x.id, url_id: x.url_id, tag: x.url_id, description: x.description }
                            return { ...item, media: media }
                        })
                        pageRef = <TPageCMainVImage[]>toSave
                        break;

                    case 'Chip':
                        toSave = (<TApiArrayItemMain[]>page).map(x => { return { id: x.id, url_id: x.url_id, tag: x.url_id } })
                        pageRef = <TPageVChip[]>toSave
                        break;

                    case 'Table':
                        toSave = (<TApiMainTable[]>page).map(x => { return { id: x.id, url_id: x.url_id, tag: x.url_id, description: x.description } })
                        pageRef = <TPageCMainVTable[]>toSave
                        break;
                }

        
        //console.log(`Saving page: ${JSON.stringify(toSave, null, 2)}`)
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
        collection
    }
})