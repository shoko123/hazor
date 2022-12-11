// routesStore.js
//handles the entire routing mechanism - parsing, loading resources, error handling

import { ref } from 'vue'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { defineStore } from 'pinia'
import { useRoutesParserStore } from './routesParser';
import { useRoutesPlanTransitionStore } from './routesPlanTransition';
import { useRoutesPrepareStore } from './routesPrepare';
import { useAuthStore } from '../auth';
import { useNotificationsStore } from '../notifications';
import { useModuleStore } from '../module';

import type { TUrlModule, TModule, TRouteInfo, TParsingError, TParseResponse, TPlanAction } from '../../../types/routesTypes';

export const useRoutesMainStore = defineStore('routesMain', () => {
    const { parse } = useRoutesParserStore()
    const { planTransition } = useRoutesPlanTransitionStore()

    const current = ref<TRouteInfo>({
        url_module: undefined,
        url_id: undefined,
        url_query_params: undefined,
        module: 'Home',
        name: 'home',
        idParams: undefined,
        queryParams: undefined
    })

    const to = ref<TRouteInfo>({
        url_module: undefined,
        url_id: undefined,
        url_query_params: undefined,
        module: 'Home',
        name: 'home',
        idParams: undefined,
        queryParams: undefined
    })

    const isLoading = ref(false)

    async function handleRouteChange(handle_to: RouteLocationNormalized, handle_from: RouteLocationNormalized): Promise<RouteLocationRaw | boolean> {
        let n = useNotificationsStore()
        let p = useRoutesPrepareStore()

        //authorize
        if (!authorize(handle_to.path)) {
            n.showSnackbar('Unauthorized; redirected to Login Page')
            return { name: 'login', params: { module: 'auth' } }
        }

        //parse (module, id, queryParams)
        let parseResponse = parse(handle_to)
        if (parseResponse.success) {
            to.value = { ...(<TRouteInfo>parseResponse.data) }
            console.log("parse OK")
        } else {
            //cancel navigation
            n.showSnackbar(`Parsing error ${parseResponse.data}; redirected to Home Page`)
            return { name: 'home' }
        };

        //verify that the transition is legal and prepare the plan required for a successful transition.
        let planResponse = planTransition(to.value, current.value)

        if (!planResponse.success) {
            console.log("plan failed...")
            n.showSnackbar(`Routes transition error ${planResponse.data}; redirected to Home Page`)
            return { name: 'home' }
        }

        console.log(`Plan successful: ${JSON.stringify(planResponse.data, null, 2)}`)

        try {
            isLoading.value = true
            let prepare = await p.prepareForNewRoute(to.value, current.value, <TPlanAction[]>planResponse.data)
            console.log(`routesMain returned from prepareForNewRoute(success)`);
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
        let module = useModuleStore()
        console.log('finalizing routing. copy to -> current')
        current.value = JSON.parse(JSON.stringify(to.value))
        
    }

    function getRouteInfo() {
        return current
    }

    function getToRouteInfo() {
        return to
    }

    function getModule() {
        return current.value.module
    }

    function getToModule() {
        return to.value.module
    }
    function toAndCurrentAreTheSameModule() {
        return to.value.module === current.value.module
    }
    return { isLoading, getModule, getToModule, getRouteInfo, getToRouteInfo, toAndCurrentAreTheSameModule, current, to, handleRouteChange }
})
