// routesPrepare
//at this point the new route is assured to be synthecly correct and all relevant fields
//are stored in routesStore from and to.
//Now we need to decide on the loading sequence and do the loading.

import { defineStore, storeToRefs } from 'pinia'
import { useXhrStore } from '../xhr';
import { useMainStore } from '../main';
import { useAuthStore } from '../auth';

import { useNotificationsStore } from '../notifications';
import { router } from '../../setups/vue-router'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { ref } from 'vue'
import { computed } from 'vue'
import { TUrlModel, TModel, TRouteInfo, TParsingError, TParseResponse } from './routesTypes';


export async function prepareForNewRoute(to: TRouteInfo, from: TRouteInfo): Promise<boolean>{

    let xhr = useXhrStore();
    let n = useNotificationsStore();

    //loa
    if(to.model !== from.model && to.model !== 'Auth' && to.model !== 'Home') {
        xhr.send('model/hydrate', 'post', { model: to.model })
        .then(res => {
          //console.log(`auth.response is ${JSON.stringify(res, null, 2)}`)
          return Promise.resolve(true)
        })
        .catch(err => {
          n.showSnackbar(`Navigation to new routes failed. Navigation cancelled`)
          console.log(`Navigation to new routes failed with err: ${JSON.stringify(err, null, 2)}`)
          return Promise.resolve(false)
        })
        .finally(() => {
          n.showSpinner(false)
        })
    }
    return Promise.resolve(true)


    
    
}
