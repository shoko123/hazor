//routesPrepare
//At this point the new route is assured to have a correct form and all
//relevant fields are stored in routesStore.from and .to. Actions needed
//to complete the transition to the new route are stored in TPlanAction[].
//Here we execute the loading of assets (collection, page, item)and other 
//activities (e.g. clearFilters, copy current -> new,), before
//proceeding to the new route.

import type { TRouteInfo, TPlanAction, TPrepareResponse } from '../../../types/routesTypes';
import { defineStore, storeToRefs } from 'pinia'
import { useXhrStore } from '../xhr';
import { useTrioStore } from '../trio';
import { useCollectionsStore } from '../collections';
import { useModuleStore } from '../module';
import { useNotificationsStore } from '../notifications';
import { useItemStore } from '../item';
import { useRoutesMainStore } from './routesMain';
import { ItemNotFoundError } from '../../setups/routes/errors';

export const useRoutesPrepareStore = defineStore('routesPrepare', () => {
  let xhr = useXhrStore();
  let n = useNotificationsStore();
  let m = useModuleStore();
  let c = useCollectionsStore()
  let t = useTrioStore();
  let i = useItemStore();
  let r = useRoutesMainStore()

  async function prepareForNewRoute(to: TRouteInfo, from: TRouteInfo, plan: TPlanAction[]): Promise<TPrepareResponse> {
    for (const x of plan) {
      switch (x) {
        case 'module.load':
          await loadTrio(to, from).catch(err => {
            throw 'ModuleInitError'
          })
          break

        case 'module.clear':
          t.clearFilters()
          break

        case 'collection.item.load':
          await loadCollectionAndItem(to, from).catch(err => {
            throw "LoadCollectionAndItemFError"
          })
          break

        case 'collection.load':
          await loadMainCollection(to, from).catch(err => {
            throw 'CollectionLoadError'
          })
          break

        case 'collection.clear':
          c.clearCollections()
          break

        case 'item.load':
          await loadItem(to, from).catch(err => {
            throw 'ItemLoadError'
          })
          break

        case 'item.clear':
          i.fields = undefined
          break

        case 'item.setIndexInCollection':
          if (!itemSetIndexInCollection()) {
            throw 'ItemNotFoundInCollectionError'
          }
          break

        case 'page.load':
          await loadPage(false)
          break

        case 'page.load1':
          await loadPage(true)
          break

        case 'page.clear':
          clearPage()
          break

          case 'item.prepareForMedia':
            prepareForMedia()
            break          

        default:
          console.log(`PrepareForNewRoute() Bad Action: ${x}`)
          throw 'RoutingBadActionError'
      }
    }
    console.log(`PrepareForNewRoute() success after completing queue`)
    return { success: true }
  }

  async function loadTrio(to: TRouteInfo, from: TRouteInfo) {
    t.clearFilters()
    n.showSpinner('Loading module data ...')
    return xhr.send('model/init', 'post', { model: to.module })
      .then(res => {
        //console.log(`auth.response is ${JSON.stringify(res, null, 2)}`)
        console.log(`model(${to.module}).init() returned (success)`)
        m.counts = res.data.counts
        m.itemViews = res.data.itemViews
        c.clearCollections()
        t.setTrio(res.data.trio)
        return true
      })
      .catch(err => {
        n.showSnackbar(`Navigation to new routes failed. Navigation cancelled`)
        console.log(`Navigation to new routes failed with err: ${JSON.stringify(err, null, 2)}`)
        throw err;
      })
      .finally(() => {
        n.showSpinner(false)
      })
  }

  async function loadCollectionAndItem(to: TRouteInfo, from: TRouteInfo) {
    n.showSpinner(`Loading ${to.url_module} ...`)
    console.log(`prepare.loadCollectionAndItem()`)

    const [col, item] = await Promise.all([
      loadMainCollection(to, from),
      loadItem(to, from)
    ])
      .catch(err => {
        throw err;
      });
  }

  async function loadMainCollection(to: TRouteInfo, from: TRouteInfo) {
    n.showSpinner(`Loading ${to.url_module} ...`)
    console.log(`prepare.loadMainCollection()`)
    return xhr.send('model/index', 'post', { model: to.module })
      .then(res => {
        c.setArray('main', res.data.collection)
        console.log(`collection loaded successfully`)
      })
      .catch(err => {
        console.log(`loadMainCollection() failed. err: ${JSON.stringify(err, null, 2)}`)
        throw err
      })
      .finally(() => {
        n.showSpinner(false)
      })
  }


  async function loadItem(to: TRouteInfo, from: TRouteInfo) {
    console.log(`prepare.loadItem() to: ${JSON.stringify(to, null, 2)}`)
    n.showSpinner(`Loading item ${to.url_id} ...`)
    return xhr.send('model/show', 'post', { model: to.module, url_id: to.url_id, variant: 0 })
      .then(res => {
        console.log(`show() returned (success)`)
        //console.log(`show() returned (success). res: ${JSON.stringify(res, null, 2)}`)
        i.fields = res.data.fields
        i.url_id = res.data.url_id
        i.tag = m.tagFromUrlId(to.module, res.data.url_id)
        return true
      })
      .catch(err => {
        console.log(`loadItem() failed`)
        throw err
      })
      .finally(() => {
        n.showSpinner(false)
      })
  }

  async function loadPage(firstPage: boolean): Promise<void> {
    console.log(`prepare.loadPage()`)

    if (firstPage) {
      console.log(`loading pageB1(1)`)
      await c.loadPage('main', 1, 0, r.to.module)
    } else {
      console.log(`Loading page according to itemIndex`)
      await c.loadPageByItemIndex(r.to.module, i.getItemIndex)
    }
  }

  function clearPage(): void {
    console.log(`prepare.ClearPage()`)
    c.mainPageArray = []
    c.main.pageNoB1 = 1
  }

  function itemSetIndexInCollection(): boolean {
    //console.log(`prepare.itemSetIndexInCollection()`)
    let itemIndex = c.itemIndexById(i.id)
    if (itemIndex === -1) {
      console.log(`Item not found in mainCollection - set itemIndex to -1, clear page`)
      c.mainPageArray = []
      i.setItemIndex(-1)
      return false
    } else {
      i.setItemIndex(itemIndex)
      return true
    }
  }


  function prepareForMedia(): void {
    console.log(`prepareForMedia()`)
    //
  }  

  return { prepareForNewRoute }
})
