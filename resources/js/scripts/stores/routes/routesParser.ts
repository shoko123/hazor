// routesStore.js
//handles the entire routing mechanism - parsing, loading resources, error handling

import type { TParsingError, TParseResponse, TName, TModule, TRouteInfo } from '../../../types/routesTypes'
import { useXhrStore } from '../xhr';
import { useMainStore } from '../main';
import { useAuthStore } from '../auth';
import { useNotificationsStore } from '../notifications';
import { router } from '../../setups/vue-router'
import type { LocationQuery, RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { ref } from 'vue'
import { computed } from 'vue'

const to: TRouteInfo = {
    url_module: null,
    url_id: null,
    url_query_params: null,
    name: 'home',
    module: 'Home',
    idParams: null,
    queryParams: null
}

const moduleConversion = {
    auth: 'Auth',
    admin: 'Admin',
    loci: 'Locus',
    fauna: 'Fauna',
    stones: "Stone"
}

export function parse(handle_to: RouteLocationNormalized): TParseResponse {
    to.name = <TName>handle_to.name
    let urlModule = handle_to.params.hasOwnProperty('module') ? handle_to.params.module : false
    let urlId = handle_to.params.hasOwnProperty('id') ? handle_to.params.id : false
    let urlQuery = Object.keys(handle_to.query).length > 0 ? handle_to.query : false

    //console.log(`parse handle_to: ${JSON.stringify(handle_to, null, 2)}`);
    console.log(`parse() name: ${to.name} urlModule: ${urlModule} urlId: ${urlId} `);
    console.log(`urlQuery: ${JSON.stringify(urlQuery, null, 2)}`);

    //parse/validate url_module
    if (urlModule) {
        if (!parseUrlModule(<string>urlModule)) {
            return { success: false, data: 'BadModuleName' }
        }
    } else {
        to.module = 'Home'
        to.url_module = ''
    }


    //parse/validate url_id
    if (urlId) {
        if (!parseUrlId(<TModule>to.module, <string>urlId)) {
            return { success: false, data: 'BadIdFormat' }
        }
    } else {
        to.idParams = null
    }

    //parse/validate queryParams
    if (urlQuery) {
        if (!parseUrlQuery(to.module, urlQuery)) {
            return { success: false, data: 'BadQueryParams' }
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
            to.module = <TModule>moduleConversion[module]
            to.url_module = module
            return true;
        default:
            console.log(`******* URL Parser error: Unsupported module name "${module}" *********`)
            return 'BadModuleName'
    }
}

function parseUrlId(module: TModule, urlId: string): TParsingError | true {
    //console.log(`parseUrlId() module: ${module}, urlId: ${urlId}`);
    switch (module) {
        case "Locus":

            break;
        case "Fauna":

            break;
        case "Stone":

            break;
    }

    return true
}

function parseUrlQuery(module: TModule | null, urlQuery: LocationQuery): TParsingError | true {
    //console.log(`parseUrlQuery() urlQuery: ${urlQuery}, urlId: ${urlId}`);

    return true
}
