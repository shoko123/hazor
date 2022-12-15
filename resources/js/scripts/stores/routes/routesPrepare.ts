//routesPrepare
//At this point the new route is assured to have a correct form and all
//relevant fields are stored in routesStore.from and .to. Actions needed
//to complete the transition to the new route are stored in TPlanAction[].
//Here we execute the loading of assets (collection, page, item)and other 
//activities (e.g. clearFilters, copy current -> new,), before
//proceeding to the new route.

import type { TRouteInfo, TPlanAction } from '../../../types/routesTypes';
import { defineStore } from 'pinia'
import { useXhrStore } from '../xhr';
import { useTrioStore } from '../trio';
import { useCollectionsStore } from '../collections';
import { useModuleStore } from '../module';
import { useNotificationsStore } from '../notifications';
import { useItemStore } from '../item';
export const useRoutesPrepareStore = defineStore('routesPrepare', () => {
  let xhr = useXhrStore();
  let n = useNotificationsStore();
  let m = useModuleStore();
  let { clearCollections, setArray, setPage, setItemIndexInMainCollection } = useCollectionsStore();
  let t = useTrioStore();
  let i = useItemStore();

  async function prepareForNewRoute(to: TRouteInfo, from: TRouteInfo, plan: TPlanAction[]): Promise<boolean> {
    for (const x of plan) {
      switch (x) {
        case 'trio.load':
          await loadTrio(to, from).catch(err => {
            return false
          })
          break

        case 'trio.clear':
          t.clearFilters()
          break

        case 'collection.item.load':
          await loadCollectionAndItem(to, from)
          break

        case 'collection.load':
          await loadMainCollection(to, from).catch(err => {
            return false
          })
          break

        case 'collection.clear':
          clearCollections()
          break

        case 'item.load':
          await loadItem(to, from).catch(err => {
            return false
          })
          break

        case 'item.clear':
          break

        default:
          console.log(`PrepareForNewRoute() Bad Action: ${x}`)
          return false
      }
    }
    console.log(`After executing plan`)
    let pageNoB1 = needToLoadPage(plan)
    if (pageNoB1) {
      console.log(`Need to load page(${pageNoB1})`)
      await setPage('main', pageNoB1, 0, to.module)
    }
    return true
  }

  function needToLoadPage(plan: TPlanAction[]): false | number {
    if (plan.includes('collection.item.load')) {
      return 1
    }
    if (plan.includes('collection.load')) {
      return 1
    }
    if (plan.includes('item.load')) {
      return 1
    }
    return false
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
        t.setTrio(res.data.trio)
        return true
      })
      .catch(err => {
        n.showSnackbar(`Navigation to new routes failed. Navigation cancelled`)
        console.log(`Navigation to new routes failed with err: ${JSON.stringify(err, null, 2)}`)
        return false
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
    setItemIndexInMainCollection(i.id)
    return true
  }

  async function loadMainCollection(to: TRouteInfo, from: TRouteInfo) {
    n.showSpinner(`Loading ${to.url_module} ...`)
    console.log(`prepare.loadMainCollection()`)
    return xhr.send('model/index', 'post', { model: to.module })
      .then(res => {
       
        setArray('main', res.data.collection)
         console.log(`mainArray was set`)
      })
      .catch(err => {
        n.showSnackbar(`Navigation to new routes failed. Navigation cancelled`)
        console.log(`Navigation to new routes failed with err: ${JSON.stringify(err, null, 2)}`)
        return false
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
        setItemIndexInMainCollection(res.data.item.id)
        return true
      })
      .catch(err => {
        console.log(`show() failed`)
        return false
      })
      .finally(() => {
        n.showSpinner(false)
      })
  }

  return { prepareForNewRoute }
})
