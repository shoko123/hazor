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
    let prepErr: TPrepareResponse = { success: false }
    for (const x of plan) {
      switch (x) {
        case 'trio.load':
          await loadTrio(to, from).catch(err => {
            prepErr.errorDetails = 'ModuleInitFailure'
            return prepErr
          })
          break

        case 'trio.clear':
          t.clearFilters()
          break

        case 'collection.item.load':
          await loadCollectionAndItem(to, from).catch(err => {
            prepErr.errorDetails = 'CollectionLoadFailure'
            return prepErr
          })
          break

        case 'collection.load':
          await loadMainCollection(to, from).catch(err => {
            prepErr.errorDetails = 'CollectionLoadFailure'
            return prepErr
          })
          break

        case 'collection.clear':
          c.clearCollections()
          break

        case 'item.load':
          await loadItem(to, from).catch(err => {
            prepErr.errorDetails = 'ItemLoadFailure'
            return prepErr
          })
          break

        case 'item.clear':
          c.itemClear()
          i.fields = undefined
          break

        case 'page.set':
          await setPage()
          break

        default:
          console.log(`PrepareForNewRoute() Bad Action: ${x}`)
          prepErr.errorDetails = 'GenericPrepareError'
          return prepErr
      }
    }

    //if item was loaded, see if it is in the collection - Yes: set itemIndex, No: remove filters and reload collection
    if (plan.includes('collection.item.load') || plan.includes('item.load')) {
      let itemIndex = c.itemIndexInMainCollection(i.id)
      if (itemIndex === -1) {
        console.log(`Item not found in mainCollection - clear filters and reload`)
      } else {
        
        console.log(`Item found in mainCollection - setting itemIndex`)
        c.setItemIndexAndPage(i.id, to.module)
      }
    }

    if (plan.includes('collection.load')) {
      console.log(`plan has collectionLoad - setting page(1)`)
      await c.setPage('main', 1, 0, to.module)
    }
    
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
        console.log(`loadCollectionAndItem() failed err: ${err}`);
        throw err;
      });
    console.log(`prepare.loadCollectionAndItem() returned (success)`);
    return true
  }

  async function loadMainCollection(to: TRouteInfo, from: TRouteInfo) {
    n.showSpinner(`Loading ${to.url_module} ...`)
    console.log(`prepare.loadMainCollection()`)
    return xhr.send('model/index', 'post', { model: to.module })
      .then(res => {
        c.setArray('main', res.data.collection)
        console.log(`mainArray was set`)
      })
      .catch(err => {
        //n.showSnackbar(`Navigation to new routes failed. Navigation cancelled`)
        console.log(`loadMainCollection failed. err: ${JSON.stringify(err, null, 2)}`)
        throw err
      })
      .finally(() => {
        n.showSpinner(false)
      })
  }


  async function loadItem(to: TRouteInfo, from: TRouteInfo) {
    console.log(`prepare.loadItem() to: ${JSON.stringify(to, null, 2)}`)
    n.showSpinner(`Loading item ${to.url_id} ...`)
    return xhr.send('model/show', 'post', { model: to.module, url_id: to.url_id })
      .then(res => {
        console.log(`show() returned (success)`)
        //console.log(`show() returned (success). res: ${JSON.stringify(res, null, 2)}`)
        i.fields = res.data.item
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

  async function setPage() {
    console.log(`prepare.setPage()`)
    let itemIndex = c.itemIndexInMainCollection(i.id)
    if (itemIndex === -1) {
      console.log(`Item not found in mainCollection - clear filters and reload`)
    } else {
      console.log(`Item found in mainCollection - setting itemIndex`)
      c.setItemIndexAndPage(i.id, r.current.module)
    }
  }


  return { prepareForNewRoute }
})
