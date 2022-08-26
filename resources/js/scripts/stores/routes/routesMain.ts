// routesStore.js
//handles the entire routing mechanism - parsing, loading resources, error handling

import { defineStore, storeToRefs } from 'pinia'
import { parse } from './routesParser';
import { planTransition } from './routesPlanTransition';
import { useRoutePrepareStore } from './routesPrepare';
import { useMainStore } from '../main';
import { useAuthStore } from '../auth';
import { useNotificationsStore } from '../notifications';
import { router } from '../../setups/vue-router'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { ref } from 'vue'
import { computed } from 'vue'
import type { TUrlModule, TModule, TRouteInfo, TParsingError, TParseResponse, TPreparePlan } from '../../../types/routesTypes';

export const useRoutesStore = defineStore('routesStore', () => {
    const current = ref<TRouteInfo>({
        url_module: null,
        url_id: null,
        url_query_params: null,
        module: 'Home',
        name: 'home',
        idParams: undefined,
        queryParams: null
    })

    const to = ref<TRouteInfo>({
        url_module: null,
        url_id: null,
        url_query_params: null,
        module: 'Home',
        name: 'home',
        idParams: undefined,
        queryParams: null
    })

    const isLoading = ref(false)

    async function handleRouteChange(handle_to: RouteLocationNormalized, handle_from: RouteLocationNormalized): Promise<RouteLocationRaw | boolean> {
        let n = useNotificationsStore()
        let p = useRoutePrepareStore()
        
        //authorize
        if (!authorize(handle_to.path)) {
            n.showSnackbar('Unauthorized; redirected to Login Page')           
            return { name: 'login', params: { module: 'auth' } }
        }

        //parse (module, id, queryParams)
        let res = parse(handle_to)
        if (res.success) {
            to.value = { ...(<TRouteInfo>res.data) }
            console.log("parse OK")
        } else {
            //cancel navigation
            n.showSnackbar(`Parsing error ${res.data}; redirected to Home Page`)
            return { name: 'home' }
        };

        //verify transitions and plan preparations needed

        let plan = planTransition(to.value, current.value)

        if (!plan.success) {

        console.log("plan failed...")
            n.showSnackbar(`Routes transition error ${plan.data}; Navigation cancelled`)
            return false//Promise.reject(false)
        }

        console.log("plan OK")

        try {
            isLoading.value = true
            let prepare = await p.prepareForNewRoute(to.value, current.value, <TPreparePlan>plan.data)
            if (!prepare) {
                return false//Promise.reject(false)
            } else {
                console.log("prepare OK")
            }

            finalizeRouting()

            //console.log(`router.beforeEach returned ${JSON.stringify(res, null, 2)}`);
            isLoading.value = false
            return true
        }
        catch (err) {
            isLoading.value = false
            console.log(`navigationErrorHandler error: ${JSON.stringify(err, null, 2)} to: ${handle_to.path}`);
            return { name: 'home' }
        }
    }

    function authorize(path: string) {
        let auth = useAuthStore()
        //console.log(`authorize() to.path: ${path} authUsersOnly: ${main.authenticatedUsersOnly}\nisLoggedIn: ${auth.authenticated}`);
        if (path === "/auth/login" || path === "/") {
            return true;
        } else if (auth.accessibility.authenticatedUsersOnly && !auth.authenticated) {
            return false
        } else {
            //console.log('authorize - TRUE')
            return true;
        }
    }

    function finalizeRouting() {
        //copy to -> current
        current.value = JSON.parse(JSON.stringify(to.value))
        console.log('finalize OK')        
    }

    return { isLoading, current, to, handleRouteChange }
})
