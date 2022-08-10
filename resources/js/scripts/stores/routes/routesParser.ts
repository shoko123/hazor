// routesStore.js
//handles the entire routing mechanism - parsing, loading resources, error handling

import type { TParsingError, TParseResponse, TModel, TRouteInfo } from './routesTypes'
import { useXhrStore } from '../xhr';
import { useMainStore } from '../main';
import { useAuthStore } from '../auth';
import { useNotificationsStore } from '../notifications';
import { router } from '../../setups/vue-router'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { ref } from 'vue'
import { computed } from 'vue'

const to: TRouteInfo = {
    url_model: null,
    url_id: null,
    url_action: null,
    url_query_params: null,
    model: 'Home',
    id_params: {},
    id_db: null,
}

const modelConversion = {
    auth: 'Auth',
    admin: 'Admin',
    loci: 'Locus',
    fauna: 'Fauna',
    stones: "Stone"
}


export function parse(handle_to: RouteLocationNormalized): TParseResponse {
    //validate module
    if (handle_to.params.hasOwnProperty('module')) {
        let res = parseModule(<string>handle_to.params.module)
        if (res === true) {
            return { success: true, data: to}
        } else {
            return { success: false, data: 'BadModelName'}
        }
    } else {
        to.model = 'Home'
        to.url_model = ''
        return { success: true, data: to}
    }
}

function parseModule(module: string): TParsingError | true {
    switch (module) {
        case "admin":
        case "auth":
        case "loci":
        case "stones":
        case 'fauna':
            to.model = <TModel>modelConversion[module]
            to.url_model = module
            return true;
        default:
            console.log(`******* URL Parser error: can\'t find module name "${module}" *********`)
            return 'BadModelName'
    }
}


    // function parseAndAuthorize(handle_to: RouteLocationNormalized, from: RouteLocationNormalized): 'ok' | 'bad-module' | 'unauthorized' {
    //     let n = useNotificationsStore()

    //     // console.log(`routes/parseAndAuth() \nfrom.path: ${JSON.stringify(from.path, null, 2)} from.params: ${JSON.stringify(from.params, null, 2)}`);
    //     // console.log(`handle_to.path: ${JSON.stringify(handle_to.path, null, 2)} handle_to.params: ${JSON.stringify(handle_to.params, null, 2)}`);

    //     //authorize
    //     if (!authorize(handle_to.path)) {
    //         n.showSnackbar('Unauthorized; redirected handle_to Login Page')
    //         return 'unauthorized'
    //     }

    //     //validate module
    //     if (handle_to.params.hasOwnProperty('module')) {
    //         if (!validateModule(<string>handle_to.params.module)) {
    //             n.showSnackbar('Navigation Error (Bad module name); redirected handle_to Home/Previous Page')
    //             return 'bad-module'
    //         }
    //     } else {
    //         to.value.model = 'Home';
    //     }

    //     //parse url_id


    //     return 'ok'

    //     // if (handle_to.params.hasOwnProperty("action")) {
    //     //     to.value.action = handle_to.params.action;
    //     // } else {
    //     //     handle_to.action = null;
    //     // }
    //     // if (payload.params.hasOwnProperty("dot")) {
    //     //     parseDot(handle_to.module, payload.params.dot);
    //     // } else {
    //     //     commit("clearDotAndDotParams");
    //     // }


    //     // //query params will only be copied on 'list' action. (We don't want unnecessary reload of chunks).
    //     // if (payload.params.hasOwnProperty("action") && payload.params.action === "list") {
    //     //     //console.log(`setting handle_to.queryParams handle_to: ${JSON.stringify(payload.query, null, 2)}`);
    //     //     handle_to.queryParams = payload.query;
    //     // }
    //     // //console.log(`parseTo.done handle_to: ${JSON.stringify(state.handle_to, null, 2)}`);
    //     // commit("handle_to", handle_to);

    //     // return handle_to;

    //     // console.log(`middleware.parsAndAuthorize ()`)

    // }

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
    //     //console.log(`parseDot handle_to: ${JSON.stringify(state.handle_to, null, 2)}`);
    // }





