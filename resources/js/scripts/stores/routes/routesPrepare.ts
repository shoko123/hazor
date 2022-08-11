// routesPrepare
//at this point the new route is assured to be synthecly correct and all relevant fields
//are stored in routesStore from and to.
//Now we need to decide on the loading sequence and do the loading.

import { defineStore, storeToRefs } from 'pinia'
import { useXhrStore } from '../xhr';
import { useMainStore } from '../main';
import { useAuthStore } from '../auth';
import { useModelStore } from '../model';
import { useNotificationsStore } from '../notifications';
import { router } from '../../setups/vue-router'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { ref } from 'vue'
import { computed } from 'vue'
import type { TUrlModel, TModel, TRouteInfo, TParsingError, TParseResponse } from '../../../types/routesTypes';

export const useRoutePrepareStore = defineStore('routePrepareStore', () => {

async function prepareForNewRoute(to: TRouteInfo, from: TRouteInfo): Promise<boolean>{

    let xhr = useXhrStore();
    let n = useNotificationsStore();
    let m = useModelStore();
    
    //if navigate to a new model initialize model (unless Auth or Home)
    if(to.model !== from.model && to.model !== 'Auth' && to.model !== 'Home') {
        await xhr.send('model/hydrate', 'post', { model: to.model })
        .then(res => {
          //console.log(`auth.response is ${JSON.stringify(res, null, 2)}`)
          m.name = <TModel>to.model
          m.counts = res.data.counts
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
    } else {
      m.name = <TModel>to.model
    }
    return true//Promise.resolve(true)


    
    
}

return { prepareForNewRoute }
})
