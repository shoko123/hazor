// routesStore.js
//handles the entire routing mechanism - parsing, loading resources, error handling

import { ref } from 'vue'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import type { TParseModuleData, TRouteInfo, TName, TParseErrorDetails, TPlanAction, TPrepareError, TModule, TUrlModule } from '../../../types/routesTypes';

import { defineStore, storeToRefs } from 'pinia'

import { useRoutesParserStore } from './routesParser';
import { useRoutesPlanTransitionStore } from './routesPlanTransition';
import { useRoutesPrepareStore } from './routesPrepare';
import { useAuthStore } from '../auth';
import { useNotificationsStore } from '../notifications';
import { EmptyResultSetError } from '../../setups/routes/errors';


export const useRoutesMainStore = defineStore('routesMain', () => {
    const { parseModule } = useRoutesParserStore()
    const { planTransition } = useRoutesPlanTransitionStore()

    const current = ref<TRouteInfo>({
        url_module: undefined,
        slug: undefined,
        url_full_path: undefined,
        module: 'Home',
        name: 'home',
        idParams: undefined,
        queryParams: undefined,
        preLoginFullPath: undefined
    })

    const to = ref<TRouteInfo>({
        url_module: undefined,
        slug: undefined,
        url_full_path: undefined,
        module: 'Home',
        name: 'home',
        idParams: undefined,
        queryParams: undefined,
        preLoginFullPath: undefined
    })

    const isLoading = ref(false)

    async function handleRouteChange(handle_to: RouteLocationNormalized, handle_from: RouteLocationNormalized): Promise<RouteLocationRaw | boolean> {
        let n = useNotificationsStore()
        let p = useRoutesPrepareStore()
        let { authenticated } = storeToRefs(useAuthStore())

        console.log(`handleRouteChange(${String(handle_from.name)} -> ${String(handle_to.name)})`)

        //authorize
        if (handle_to.name === "login" && authenticated.value) {
            console.log(`Authenticated user trying to access login route. to.name: ${handle_to.name}, authenticated: ${authenticated.value}`)
            return (handle_from)
        }

        if (!authorize(handle_to.path)) {
            n.showSnackbar('Unauthorized; redirected to Login Page')
            return { name: 'login', params: { module: 'auth' } }
        }

        to.value.name = <TName>handle_to.name
        to.value.url_full_path = handle_to.fullPath
        //parse module 
        //console.log(`A.current: ${JSON.stringify(current.value, null, 2)}\nto: ${JSON.stringify(to.value, null, 2)})`)
        if (handle_to.params.hasOwnProperty('module')) {
            let res = parseModule(<string>handle_to.params.module)
            if (res.success) {
                let data = <TParseModuleData>res.data
                to.value.module = data.module
                to.value.url_module = data.url_module
            }
            else {
                console.log(`parseModule returned ${JSON.stringify(res, null, 2)}`)
                n.showSnackbar(`${(<TParseErrorDetails>res.data).message}; redirected to Home Page`)
                return goHome()
            }
        } else {
            to.value.module = 'Home'
            to.value.url_module = ''
        }

        //console.log(`after successful module parse. to: ${JSON.stringify(to.value, null, 2)})`)

        //verify that the transition is legal and prepare the plan required for a successful transition.

        let planResponse = planTransition(handle_to, handle_from)

        if (!planResponse.success) {
            console.log("plan failed...")
            n.showSnackbar(`Routes transition error ${planResponse.data}; redirected to Home Page`)
            return goHome()
        }

        //console.log(`Plan successful: ${JSON.stringify(planResponse.data, null, 2)}`)
        //prepare - access server and load stuff (async)
        isLoading.value = true

        try {
            await p.prepareForNewRoute(to.value.module, handle_to.query, <string>handle_to.params.slug, <TPlanAction[]>planResponse.data, handle_from.name === undefined)
            finalizeRouting(handle_to, handle_from)

            //console.log(`router.beforeEach returned ${JSON.stringify(res, null, 2)}`);
            isLoading.value = false
            return true
        }
        catch (err) {
            isLoading.value = false
            if (err === EmptyResultSetError && handle_from.name === 'filter') {
                console.log(`EMPTY ERROR`)
                n.showSnackbar('No results returned. Please modify query and resubmit!')
                return { name: 'filter' }
            }
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

    function finalizeRouting(handle_to: RouteLocationNormalized, handle_from: RouteLocationNormalized) {
        current.value.name = <TName>handle_to.name
        current.value.module = to.value.module
        current.value.url_module = to.value.url_module
        current.value.queryParams = ['index', 'show'].includes(current.value.name) ? handle_to.query : undefined
        current.value.url_full_path = handle_to.fullPath
        current.value.preLoginFullPath = to.value.url_module === 'auth' ? handle_from.fullPath: undefined
        
        switch (handle_to.name) {
            case 'show':
            case 'update':
            case 'media':
            case 'tag':
                current.value.slug = <string>handle_to.params.slug
                current.value.idParams = to.value.idParams
                break
            default:
                current.value.slug = undefined
                current.value.idParams = undefined
        }

        //console.log(`finalizing routing. current: ${JSON.stringify(current.value)}`)
        //current.value = Object.assign(to.value);
        //current.value = JSON.parse(JSON.stringify(to.value))
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
