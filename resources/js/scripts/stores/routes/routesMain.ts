// routesStore.js
//handles the entire routing mechanism - parsing, loading resources, error handling

import { defineStore, storeToRefs } from 'pinia'
import { parse } from './routesParser';
import { prepareForNewRoute } from './routesPrepare';
import { useMainStore } from '../main';
import { useAuthStore } from '../auth';
import { useNotificationsStore } from '../notifications';
import { router } from '../../setups/vue-router'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { ref } from 'vue'
import { computed } from 'vue'
import { TUrlModel, TModel, TRouteInfo, TParsingError, TParseResponse } from './routesTypes';

export const useRoutesStore = defineStore('routesStore', () => {
    const from = ref<TRouteInfo>({
        url_model: null,
        url_id: null,
        url_action: null,
        url_query_params: null,
        model: null,
        id_params: {},
        id_db: null,
    })

    const to = ref<TRouteInfo>({
        url_model: null,
        url_id: null,
        url_action: null,
        url_query_params: null,
        model: null,
        id_params: {},
        id_db: null,
    })

    const localFilters = ref(null)
    const loading = ref(false)

    const isLoading = computed((state) => {
        return false
    })
   
    async function handleRouteChange(handle_to: RouteLocationNormalized, handle_from: RouteLocationNormalized): Promise<RouteLocationRaw | boolean> {
        let n = useNotificationsStore()
        //authorize
        if (!authorize(handle_to.path)) {
            n.showSnackbar('Unauthorized; redirected to Login Page')
            return { path: '/auth/login' }
        }

        //parse
        let res = parse(handle_to)
        if (res.success) {
            // target.value.model = (<TRouteInfo>res.data).model
            // target.value.url_model = (<TRouteInfo>res.data).url_model
            to.value = {...(<TRouteInfo>res.data)}
            console.log("parse OK")
        } else {
            //cancel navigation
            n.showSnackbar(`Parsing error ${res.data}; redirected to Home Page`)
            return { path: '/' }//Promise.reject(false)
        };

        try {


            let prepare = prepareForNewRoute(to.value, from.value)
            if (!prepare) {
                //cancel navigation
                return Promise.reject(false)
            } else {
                console.log("prepare OK")
            };

            // finalizeRouting("gg")

            //console.log(`router.beforeEach returned ${JSON.stringify(res, null, 2)}`);
            return true
        }
        catch (err) {
            console.log(`navigationErrorHandler error: ${JSON.stringify(err, null, 2)} to: ${handle_to.path}`);
            return false
        }

    }

    function authorize(path: string) {
        let auth = useAuthStore()
        let main = useMainStore()
        //console.log(`authorize() to.path: ${path} authUsersOnly: ${main.authenticatedUsersOnly}\nisLoggedIn: ${auth.authenticated}`);
        if (path === "/auth/login" || path === "/") {
            return true;
        } else if (main.authenticatedUsersOnly && !auth.authenticated) {
            return false
        } else {
            //console.log('authorize - TRUE')
            return true;
        }
    }

    function finalizeRouting(path: string) {


    }





    return { prepareForNewRoute, isLoading, from, to, handleRouteChange }
})
