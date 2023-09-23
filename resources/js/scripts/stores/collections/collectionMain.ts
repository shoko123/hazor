// collection.ts
//handles all collections and loading of pages
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { TCollectionExtra, TApiArray, TApiArrayMain, TApiPageMainImage, TApiPageTableLocus, TCView, TApiPage, TPageItem, TCollectionView, TPageCMainVImage, TPageCMainVTable, TPageVChip } from '@/js/types/collectionTypes'
import { TModule } from '../../../types/routesTypes'
import { useCollectionsStore } from './collections'
import { useModuleStore } from '../module'
import { useXhrStore } from '../xhr'
import { useMediaStore } from '../media'
import { useNotificationsStore } from '../notifications'

export const useCollectionMainStore = defineStore('collectionMain', () => {
    const { send } = useXhrStore()
    const { showSnackbar } = useNotificationsStore()
    const { buildMedia } = useMediaStore()
    const { tagFromSlug } = useModuleStore()
    const c = useCollectionsStore()

    let extra = ref<TCollectionExtra>({
        length: 0,
        pageNoB1: 1,
        views: <TCView[]>[{ name: 'Table', ipp: 500} , { name: 'Image', ipp: 36}, { name: 'Chip', ipp: 200}],
        viewIndex: 0,
    })

    let array = ref<TApiArrayMain[]>([])

    let page = ref<TApiPage[]>([])

    const collection = computed(() => {
        return {
            array: array.value,
            page: page.value,//computedPage.value,
            extra: extra.value
        }
    })

    const ipp = computed(() => {
        return  extra.value.views[extra.value.viewIndex].ipp     
    })

    function setArray(data: TApiArray[]) {
        array.value = <TApiArrayMain[]>data
        extra.value.length = data.length
    }

    async function loadPage(pageNoB1: number, view: TCView, module: TModule): Promise<boolean> {
        let ipp = view.ipp
        let start = (pageNoB1 - 1) * ipp

        console.log(`collectionMain.loadPage() view: ${view} pageB1: ${pageNoB1}  ipp: ${ipp} startIndex: ${start} endIndex: ${start + ipp - 1} module: ${module} `);

        switch (view.name) {
            //if 'Chip' do nothing - page will be extracted from array
            case 'Chip':
                //savePage(array.value.slice(start, start + ipp), view, module)
                extra.value.pageNoB1 = pageNoB1
                //extra.value.viewIndex = viewIndex
                let slice = array.value.slice(start, start + ipp)
                savePage(slice, view, module)
                return true

            case 'Image':
            case 'Table':

                let ids = array.value.slice(start, start + ipp).map(x => x.id);


                if (ids.length === 0) {
                    console.log(`ids.length is 0 - returning`)
                    savePage([], view, module)
                    return true
                }



                await send('model/page', 'post', { model: module, view: view.name, ids })
                    .then(res => {
                        //console.log(`model.page() returned (success)`)
                        savePage(res.data.page, view, module)
                        extra.value.pageNoB1 = pageNoB1
                        //extra.value.viewIndex = viewIndex
                        return true
                    })
                    .catch(err => {
                        showSnackbar(`main.loadPage() failed`)
                        console.log(`loadPage failed. err: ${JSON.stringify(err, null, 2)}`)
                        return false
                    })
                    .finally(() => {
                        //console.log(`main.loadPage() finally`)
                        return true
                    })
                return true
        }
    }

    function savePage(apiPage: TApiPage[], view: TCView, module: TModule): void {
        let toSave = []

        switch (view.name) {
            case 'Image':
                toSave = (<TApiPageMainImage[]>apiPage).map(x => {
                    const media = buildMedia(x.media1, module)
                    const item = { id: x.id, slug: x.slug, tag: tagFromSlug(module, x.slug), short: x.short }
                    return { ...item, media: media }
                })
                page.value = <TPageCMainVImage[]>toSave
                break;

            case 'Table':
                toSave = (<TApiPageTableLocus[]>apiPage).map(x => { return { ...x, tag: tagFromSlug(module, x.slug)} })
                page.value = toSave
                break;

            case 'Chip':
                toSave = (<TApiArrayMain[]>apiPage).map(x => { return { ...x, tag: tagFromSlug(module, x.slug) } })
                page.value = <TPageVChip[]>toSave
                break;
        }
        //console.log(`mainCollection.savePage() length: ${toSave.length}\npage:\n${JSON.stringify(page.value, null, 2)}`)
    }

    function itemIndexById(id: number) {
        let index = array.value.findIndex(x => x.id === id)
        //console.log(`collectionMain.itemIndexById(id:${id}) array: ${JSON.stringify(array.value.slice(0,5), null, 2)} index: ${index}`)
        return index

    }

    function itemIsInPage(id: number) {
        return page.value.some((x) => (<TPageCMainVImage>x).id === id)
    }

    function itemByIndex(index: number): TApiArray {
        return array.value[index]

    }
    function removeItemFromArrayById(id: number): number {
        const newArray = array.value.filter(x => x.id !== id)
        array.value = newArray
        extra.value.length--
        return newArray.length
    }

    function pushToArray(arrayItem: TApiArrayMain): number {
        extra.value.length = array.value.push(arrayItem)
        return array.value.length - 1
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
        ipp,
        array,
        page,
        loadPage,
        itemIndexById,
        setArray,
        collection,
        itemIsInPage,
        itemByIndex,
        removeItemFromArrayById,
        pushToArray,
        clear,
    }
})