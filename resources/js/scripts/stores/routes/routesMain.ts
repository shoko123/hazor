// routesStore.js
//handles the entire routing mechanism - parsing, loading resources, error handling

import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useRouter, type LocationQueryRaw, type RouteLocationNormalized, type RouteLocationRaw } from 'vue-router'
import type { TParseModuleData, TRouteInfo, TPageName, TParseErrorDetails, TPlanAction, TPrepareError, TModule } from '../../../types/routesTypes';

import { useRoutesParserStore } from './routesParser'
import { useRoutesPlanTransitionStore } from './routesPlanTransition'
import { useRoutesPrepareStore } from './routesPrepare'
import { useAuthStore } from '../auth'
import { useNotificationsStore } from '../notifications'
import { EmptyResultSetError } from '../../setups/routes/errors'
import { useCollectionMainStore } from '../collections/collectionMain'
import { useFilterStore } from '../trio/filter'

export const useRoutesMainStore = defineStore('routesMain', () => {

    const urlModuleFromModule: { [key in TModule]: string; } = {
        Home: 'home',
        Auth: 'auth',
        Admin: 'admin',
        Locus: 'loci',
        Fauna: 'fauna',
        Stone: "stones"
    }

    const router = useRouter()
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

    const inTransition = ref(false)



    async function handleRouteChange(handle_to: RouteLocationNormalized, handle_from: RouteLocationNormalized): Promise<RouteLocationRaw | boolean> {
        const { showSnackbar } = useNotificationsStore()
        const { prepareForNewRoute } = useRoutesPrepareStore()
        const { authenticated } = storeToRefs(useAuthStore())

        console.log(`handleRouteChange(${String(handle_from.name)} -> ${String(handle_to.name)})`)

        //authorize
        if (handle_to.name === "login" && authenticated.value) {
            console.log(`Authenticated user trying to access login route. to.name: ${handle_to.name}, authenticated: ${authenticated.value}`)
            return (handle_from)
        }

        if (!authorize(handle_to.path)) {
            showSnackbar('Unauthorized; redirected to Login Page')
            return { name: 'login', params: { module: 'auth' } }
        }

        to.value.name = <TPageName>handle_to.name
        to.value.url_full_path = handle_to.fullPath
        //parse module 
        //console.log(`A.current: ${JSON.stringify(current.value, null, 2)}\nto: ${JSON.stringify(to.value, null, 2)})`)
        if (handle_to.params.hasOwnProperty('module')) {
            const res = parseModule(<string>handle_to.params.module)
            if (res.success) {
                const data = <TParseModuleData>res.data
                to.value.module = data.module
                to.value.url_module = data.url_module
            }
            else {
                console.log(`parseModule returned ${JSON.stringify(res, null, 2)}`)
                showSnackbar(`${(<TParseErrorDetails>res.data).message}; redirected to Home Page`)
                return goHome()
            }
        } else {
            to.value.module = 'Home'
            to.value.url_module = ''
        }

        //console.log(`after successful module parse. to: ${JSON.stringify(to.value, null, 2)})`)

        //verify that the transition is legal and prepare the plan required for a successful transition.

        const planResponse = planTransition(handle_to, handle_from)

        if (!planResponse.success) {
            console.log("plan failed...")
            showSnackbar(`Routes transition error ${planResponse.data}; redirected to Home Page`)
            return goHome()
        }

        console.log(`Plan successful: ${JSON.stringify(planResponse.data, null, 2)}`)
        //prepare - access server and load stuff (async)
        inTransition.value = true

        try {
            await prepareForNewRoute(to.value.module, handle_to.query, <string>handle_to.params.slug, <TPlanAction[]>planResponse.data, handle_from.name === undefined)
            finalizeRouting(handle_to, handle_from)

            //console.log(`router.beforeEach returned ${JSON.stringify(res, null, 2)}`);
            inTransition.value = false
            return true
        }
        catch (err) {
            inTransition.value = false
            if (err === EmptyResultSetError && handle_from.name === 'filter') {
                console.log(`EMPTY ERROR`)
                showSnackbar('No results returned. Please modify query and resubmit!')
                return { name: 'filter' }
            }
            showSnackbar('Unexpected Error - redirceted to Home page')
            console.log(`unexpected prepare() error: ${JSON.stringify(err, null, 2)} redirect to home`);
            return goHome()
        }
    }

    function authorize(path: string) {
        const auth = useAuthStore()
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
        current.value.name = <TPageName>handle_to.name
        current.value.module = to.value.module
        current.value.url_module = to.value.url_module
        current.value.queryParams = ['index', 'show'].includes(current.value.name) ? handle_to.query : undefined
        current.value.url_full_path = handle_to.fullPath
        current.value.preLoginFullPath = to.value.url_module === 'auth' ? handle_from.fullPath : undefined

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
        inTransition.value = false
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


    function routerPush(routeName: string, slug: string = "none", module: TModule | "current" = "current", keepQuery: boolean = true) {
        let urlModule, query = null
        switch (routeName) {
            case ('back1'):
                router.go(-1)
                break

            case 'home':
            case 'dashboard':
                router.push({ name: routeName })
                break

            case 'login':
            case 'register':
            case 'forgot-password':
            case 'reset-password':
                router.push({ name: routeName, params: { module: 'auth' } })
                break



            case 'welcome':
            case 'filter':
            case 'create':
                urlModule = (module === "current") ? getUrlModule() : urlModuleFromModule[module]
                router.push({ name: routeName, params: { module: urlModule } })
                break

            case 'index':
                urlModule = (module === "current") ? getUrlModule() : urlModuleFromModule[module]
                query = keepQuery ? current.value.queryParams : ""
                router.push({ name: 'index', params: { module: urlModule }, query: <LocationQueryRaw>query })
                break

            case 'show':
                urlModule = (module === "current") ? getUrlModule() : urlModuleFromModule[module]
                query = keepQuery ? current.value.queryParams : ""
                router.push({ name: 'show', params: { module: urlModule, slug: slug }, query: <LocationQueryRaw>query })
                break

            case 'update':
            case 'media':
            case 'tag':
                router.push({ name: routeName, params: { module: getUrlModule(), slug: slug } })
                break
        }
    }

    function moveFromItemToItem(slug: string, id: number, module: TModule | "current" = "current") {
        const { itemIndexById } = useCollectionMainStore()
        const { clearSelectedFilters } = useFilterStore()
        const { showSnackbar } = useNotificationsStore()
        console.log(`moveFromItemToItem "${current.value.module} ${current.value.slug}" -> "${module} ${slug}" (id: ${id})`)
        if (current.value.module === module) {
            if (current.value.slug === slug) {
                console.log(`moveTo same item - ignore`)
                return
            }
            if (itemIndexById(id) !== -1) {
                console.log(`moveTo item that is already in the current collection - go!`)
                routerPush('show', slug, module)
            } else {
                console.log(`moveTo item that is NOT in the current collection - remove filters and reload collection!`)
                clearSelectedFilters()
                showSnackbar(`Filters removed and result set reloaded`)
                routerPush('show', slug, module, false)
            }
        } else {
            console.log(`GoTo item in a different module`)
            routerPush('show', slug, module, false)
        }
    }
    return { inTransition, getModule, getUrlModule, getToModule, getRouteInfo, getToRouteInfo, toAndCurrentAreTheSameModule, current, to, handleRouteChange, routerPush, moveFromItemToItem }
})
