// routesStore.js
//handles the entire routing mechanism - parsing, loading resources, error handling

import type { TParsingError, TParseResponse, TModel, TRouteInfo } from '../../../types/routesTypes'
import { useXhrStore } from '../xhr';
import { useMainStore } from '../main';
import { useAuthStore } from '../auth';
import { useNotificationsStore } from '../notifications';
import { router } from '../../setups/vue-router'
import type { LocationQuery, RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { ref } from 'vue'
import { computed } from 'vue'

const to: TRouteInfo = {
    url_model: null,
    url_id: null,
    url_action: null,
    url_query_params: null,
    model: 'Home',
    action: '',
    idParams: null,
    queryParams: null
}

const modelConversion = {
    auth: 'Auth',
    admin: 'Admin',
    loci: 'Locus',
    fauna: 'Fauna',
    stones: "Stone"
}


export function parse(handle_to: RouteLocationNormalized): TParseResponse {
    let urlModel = handle_to.params.hasOwnProperty('module') ? handle_to.params.module : false
    let urlAction = handle_to.params.hasOwnProperty('action') ? handle_to.params.action : false
    let urlId = handle_to.params.hasOwnProperty('id') ? handle_to.params.id : false
    let urlQuery = Object.keys(handle_to.query).length > 0 ? handle_to.query : false

    //console.log(`parse handle_to: ${JSON.stringify(handle_to, null, 2)}`);
    
    //parse/validate url_module
    if (urlModel) {
        let res = parseUrlModule(<string>urlModel)
        if (res === true) {
            return { success: true, data: to }
        } else {
            return { success: false, data: 'BadModelName' }
        }
    } else {
        to.model = 'Home'
        to.url_model = ''

    }

    //validate url_action
    if (urlAction) {
        switch (urlAction) {
            case "welcome":
            case "filter":
            case "index":
            case "update":
            case 'create':
                break
            default:
                console.log(`******* URL Parser error: nsupported action name "${urlAction}" *********`)
                return { success: false, data: 'BadActionName' }
        }
    } else {
        to.action = <string>urlAction;
    }

    //parse/validate url_id
    if (urlId) {
        let res = parseUrlId(to.model, <string>urlId);
        if (res === true) {
            return { success: true, data: to }
        } else {
            return { success: false, data: 'BadModelName' }
        }
    } else {
        to.idParams = null
    }

     //parse/validate queryParams
     if (urlQuery) {
        let res = parseUrlQuery(to.model, urlQuery);
        if (res === true) {
            return { success: true, data: to }
        } else {
            return { success: false, data: 'BadModelName' }
        }
    } else {
        to.idParams = null
    }
    return { success: true, data: to }

}



function parseUrlModule(module: string): TParsingError | true {
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
            console.log(`******* URL Parser error: Unsupported module name "${module}" *********`)
            return 'BadModelName'
    }
}

function parseUrlId(model: TModel, urlId: string): TParsingError | true {
    //console.log(`parseUrlId() model: ${module}, urlId: ${urlId}`);
    switch (model) {
        case "Locus":

            break;
        case "Fauna":

            break;
        case "Stone":

            break;
    }

    return true
}

function parseUrlQuery(model: TModel | null, urlQuery: LocationQuery): TParsingError | true {
    //console.log(`parseUrlQuery() urlQuery: ${urlQuery}, urlId: ${urlId}`);
    
    return true
}
