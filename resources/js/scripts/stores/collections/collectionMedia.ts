// collection.ts
//handles all collections and loading of pages
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TModule } from '../../../types/routesTypes'
import { TApiMedia, TApiArrayMedia, TApiPageMedia, TPageCMediaVImage, TCollectionExtra, TPageItem, TCollectionView, TApiArray, TApiPage } from '@/js/types/collectionTypes'
import { useCollectionsStore } from './collections'
import { useRoutesMainStore } from '../routes/routesMain'
import { useXhrStore } from '../xhr'
import { useMediaStore } from '../media'
import { useNotificationsStore } from '../notifications'

export const useCollectionMediaStore = defineStore('collectionMedia', () => {
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

    let page = ref<TPageCMediaVImage[]>([])

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

        //////////////
        await send('media/page', 'post', { ids: slice.map(x => x.id) })
            .then(res => {
                console.log(`media.page() returned (success)`)
                savePage(res.data.res, module)
                extra.value.pageNoB1 = pageNoB1
                extra.value.viewIndex = extra.value.views.indexOf(view)
                return true
            })
            .catch(err => {
                showSnackbar(`media.loadPage() failed`)
                console.log(`media.loadPage failed. err: ${JSON.stringify(err, null, 2)}`)
                return false
            })
            .finally(() => {
                console.log(`media.loadPage() finally`)
                return true
            })
        return true
        /////////////
        savePage(<TApiPageMedia[]>slice, module)
        return true


    }

    function savePage(apiPage: TApiPageMedia[], module: TModule) {
        let toSave = []
        let pageRef = <TPageItem[]>([])



        toSave = (<TApiPageMedia[]>apiPage).map(x => {
            const media = buildMedia(x, module)
            const item = { id: x.id, description: x.description, tag: "media tag" }
            return { ...item, media: media }
        })
        page.value = <TPageCMediaVImage[]>toSave
        //console.log(`media.savePage() length: ${toSave.length}`)
    }



    function itemIndexById(id: number) {
        let index = array.value.findIndex(x => x?.id === id)
        //console.log(`itemIndexById(id:${id}) index: ${index}`)
        return index

    }

    function itemIsInPage(id: number) {
        return page.value.some((x) => x.media.id === id)
    }

    function itemByIndex(index: number): TApiArray {
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