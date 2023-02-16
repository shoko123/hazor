// routesStore.js
//handles the entire routing mechanism - parsing, loading resources, error handling

import { ref } from 'vue'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { defineStore, storeToRefs } from 'pinia'
import { useRoutesParserStore } from './routesParser';
import { useRoutesPlanTransitionStore } from './routesPlanTransition';
import { useRoutesPrepareStore } from './routesPrepare';
import { useAuthStore } from '../auth';
import { useNotificationsStore } from '../notifications';
import { useModuleStore } from '../module';
import { useXhrStore } from '../xhr';
import type { TUrlModule, TModule, TRouteInfo, TParsingError, TParseResponse, TPlanAction, TPrepareError } from '../../../types/routesTypes';

export const useRoutesMainStore = defineStore('routesMain', () => {
    const { parse } = useRoutesParserStore()
    const { planTransition } = useRoutesPlanTransitionStore()

    const current = ref<TRouteInfo>({
        url_module: undefined,
        url_id: undefined,
        url_query_string: undefined,
        module: 'Home',
        name: 'home',
        idParams: undefined,
        queryParams: undefined
    })

    const to = ref<TRouteInfo>({
        url_module: undefined,
        url_id: undefined,
        url_query_string: undefined,
        module: 'Home',
        name: 'home',
        idParams: undefined,
        queryParams: undefined
    })

    const isLoading = ref(false)

    async function handleRouteChange(handle_to: RouteLocationNormalized, handle_from: RouteLocationNormalized): Promise<RouteLocationRaw | boolean> {
        let n = useNotificationsStore()
        let p = useRoutesPrepareStore()
        let { authenticated } = storeToRefs(useAuthStore())

        console.log(`handleRouteChange(${String(handle_from.name)} -> ${String(handle_to.name)})`)
        //console.log(`handleRouteChange(${JSON.stringify(handle_to, null, 2)})`)

        //authorize
        if (handle_to.name === "login" && authenticated.value) {
            console.log(`Authenticated user trying to access login route. to.name: ${handle_to.name}, authenticated: ${authenticated.value}`)
            return (handle_from)
        }

        if (!authorize(handle_to.path)) {
            n.showSnackbar('Unauthorized; redirected to Login Page')
            return { name: 'login', params: { module: 'auth' } }
        }

        //parse (module, id, queryParams), and save to local storage (to).
        let parseResponse = parse(handle_to)
        if (parseResponse.success) {
            to.value = { ...(<TRouteInfo>parseResponse.data) }
            console.log("parse OK")
        } else {
            //cancel navigation
            n.showSnackbar(`Parsing error ${parseResponse.data}; redirected to Home Page`)
            return goHome()
        };

        //verify that the transition is legal and prepare the plan required for a successful transition.
        let planResponse = planTransition(to.value, current.value)

        if (!planResponse.success) {
            console.log("plan failed...")
            n.showSnackbar(`Routes transition error ${planResponse.data}; redirected to Home Page`)
            return goHome()
        }

        console.log(`Plan successful: ${JSON.stringify(planResponse.data, null, 2)}`)

        //prepare - access server and load stuff (async)
        isLoading.value = true

        try {         
            await p.prepareForNewRoute(to.value, current.value, <TPlanAction[]>planResponse.data)
            // console.log(`routesMain returned from prepareForNewRoute(no exception!) prepare: ${JSON.stringify(prepare, null, 2)}`);
            // if (!prepare.success) {
            //     console.log(`known prepare() error: ${prepare.errorDetails}`)
            //     throw prepare.errorDetails
            //     //return handlePrepareError(<TPrepareError>prepare.errorDetails)
            // } else {
            //     console.log("prepare OK")
            // }

            finalizeRouting()

            //console.log(`router.beforeEach returned ${JSON.stringify(res, null, 2)}`);
            isLoading.value = false
            return true
        }
        catch (err) {
            isLoading.value = false
            n.showSnackbar('Unexpected Error - redirceted to Home page')
            console.log(`unexpected prepare() error: ${JSON.stringify(err, null, 2)} redirect to home`);
            return goHome()
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

    function handlePrepareError(errorDetails: TPrepareError): Promise<RouteLocationRaw | boolean> {   
        console.log(`handlePrepareError: ${JSON.stringify(errorDetails)}`)
        return Promise.resolve(false)
    }

    function finalizeRouting() {
        let module = useModuleStore()
        console.log(`finalizing routing. copy to -> current to: ${JSON.stringify(to.value)}`)
        current.value = JSON.parse(JSON.stringify(to.value))
    }
    function goHome() {
        console.log(`goHome`)
        isLoading.value = false
        return { name: 'home' }
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

    function getUrlModule() {
        return current.value.url_module
    }

    function getToModule() {
        return to.value.module
    }
    function toAndCurrentAreTheSameModule() {
        return to.value.module === current.value.module
    }

    

    return { isLoading, getModule, getUrlModule, getToModule, getRouteInfo, getToRouteInfo, toAndCurrentAreTheSameModule, current, to, handleRouteChange }
})
