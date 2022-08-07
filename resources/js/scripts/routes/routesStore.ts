// routesStore.js
//handles the entire routing mechanism - parsing, loading resources, error handling

import { defineStore, storeToRefs } from 'pinia'
import { useXhrStore } from '../stores/xhr';
import { useMainStore } from '../stores/main';
import { useAuthStore } from '../stores/auth';
import { useNotificationsStore } from '../stores/notifications';
import { router } from '../setups/vue-router'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { ref } from 'vue'
import { computed } from 'vue'

export const useRoutesStore = defineStore('routesStore', () => {
    type TUrlModel = 'auth' | 'admin' | 'loci' | 'fauna' | 'stones'
    type TModel = 'Auth' | 'Admin' | 'Locus' | 'Fauna' | 'Stone'

    type TRouteInfo = {
        url_model: TUrlModel | null,
        url_id: string | null,
        action: string | null,
        url_query_params: string | null,
        model: string | null,
        id_params: object | null,
        id_db: number | null
    }

    const modelConversion = {
        auth: 'Auth',
        admin: 'Admin',
        loci: 'Locus',
        fauna: 'Fauna',
        stones: "Stone"
    }

    const from = ref<TRouteInfo>({
        url_model: null,
        url_id: null,
        action: null,
        url_query_params: null,
        model: null,
        id_params: {},
        id_db: null,
    })

    const target = ref<TRouteInfo>({
        url_model: null,
        url_id: null,
        action: null,
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

    async function handleRouteChange(to: RouteLocationNormalized, from: RouteLocationNormalized): Promise<RouteLocationRaw | boolean>{
          let n = useNotificationsStore()
          //authorize
         if (!authorize(to.path)) {
            n.showSnackbar('Unauthorized; redirected to Login Page')
            return { path: '/auth/login' }
        }
        //parseAndAuthorize(to, from)
        return true
    }

    function parseAndAuthorize(to: RouteLocationNormalized, from: RouteLocationNormalized): 'ok' | 'bad-module' | 'unauthorized' {
        let n = useNotificationsStore()

        // console.log(`routes/parseAndAuth() \nfrom.path: ${JSON.stringify(from.path, null, 2)} from.params: ${JSON.stringify(from.params, null, 2)}`);
        // console.log(`to.path: ${JSON.stringify(to.path, null, 2)} to.params: ${JSON.stringify(to.params, null, 2)}`);

        //authorize
        if (!authorize(to.path)) {
            n.showSnackbar('Unauthorized; redirected to Login Page')
            return 'unauthorized'
        }

        //validate module
        if (to.params.hasOwnProperty('module')) {
            if (!validateModule(<string>to.params.module)) {
                n.showSnackbar('Navigation Error (Bad module name); redirected to Home/Previous Page')
                return 'bad-module'
            }
        } else {
            target.value.model = 'Home';
        }

        //parse url_id


        return 'ok'

        // if (to.params.hasOwnProperty("action")) {
        //     target.value.action = to.params.action;
        // } else {
        //     to.action = null;
        // }
        // if (payload.params.hasOwnProperty("dot")) {
        //     parseDot(to.module, payload.params.dot);
        // } else {
        //     commit("clearDotAndDotParams");
        // }


        // //query params will only be copied on 'list' action. (We don't want unnecessary reload of chunks).
        // if (payload.params.hasOwnProperty("action") && payload.params.action === "list") {
        //     //console.log(`setting to.queryParams to: ${JSON.stringify(payload.query, null, 2)}`);
        //     to.queryParams = payload.query;
        // }
        // //console.log(`parseTo.done to: ${JSON.stringify(state.to, null, 2)}`);
        // commit("to", to);

        // return to;

        // console.log(`middleware.parsAndAuthorize ()`)

    }

    function authorize(path: string) {
        let auth = useAuthStore()
        let main = useMainStore()
        console.log(`authorize() to.path: ${path} authUsersOnly: ${main.authenticatedUsersOnly}\nisLoggedIn: ${auth.authenticated}`);
        if (path === "/auth/login" || path === "/") {
            return true;
        } else if (main.authenticatedUsersOnly && !auth.authenticated) {
           return false
        } else {
            console.log('authorize - TRUE')
            return true;
        }

    }
    function validateModule(module: string): boolean {
        switch (module) {
            case "admin":
            case "auth":
            case "loci":
            case "stones":
            case 'fauna':
                target.value.model = modelConversion[module]
                target.value.url_model = module
                return true;
            default:
                console.log(`******* URL Parser error: can\'t find module name "${module}" *********`)
                return false
        }
    }

  

    // function parseDot(module, dot) {
    //     //console.log(`parseDot() module: ${module}, dot: ${dot}`);
    //     let arr = dot.split('.');
    //     let dotParams = {};
    //     switch (module) {
    //         case "About":
    //             dotParams.tab = parseInt(arr[0]);
    //             dotParams.no = parseInt(arr[1]);
    //             break;
    //         case "Area":
    //             dotParams.area = arr[0];
    //             break;
    //         case "Season":
    //             dotParams.season = parseInt(arr[0]);
    //             break;
    //         case "AreaSeason":
    //             dotParams.season = parseInt(arr[0]);
    //             dotParams.area = arr[1];
    //             break;
    //         case "Locus":
    //             dotParams.season = parseInt(arr[0]);
    //             dotParams.area = arr[1];
    //             dotParams.locus_no = parseInt(arr[2]);
    //             break;
    //         case "Pottery":
    //         case "Stone":
    //         case "Lithic":
    //         case "Metal":
    //         case "Glass":
    //         case "Flora":
    //         case "Fauna":
    //         case "Tbd":
    //             dotParams.season = parseInt(arr[0]);
    //             dotParams.area = arr[1];
    //             dotParams.locus_no = parseInt(arr[2]);
    //             dotParams.registration_category = arr[3];
    //             dotParams.basket_no = parseInt(arr[4]);
    //             dotParams.artifact_no = parseInt(arr[5]);
    //             break;
    //     }

    //     commit("dot", dot);
    //     commit("dotParams", dotParams);
    //     //console.log(`parseDot to: ${JSON.stringify(state.to, null, 2)}`);
    // }

    async function prepareForNewRoute(to: RouteLocationNormalized, from: RouteLocationNormalized) {
        console.log(`middleware.prepareForNewRoute ()`)
        //console.log(`middleware.authorize() to.path: ${to.path} appSettings: ${JSON.stringify(appSettings, null, 2)}\nisLoggedIn: ${isLoggedIn}`);
    }

    return { parseAndAuthorize, prepareForNewRoute, isLoading, from, target, handleRouteChange }
})
