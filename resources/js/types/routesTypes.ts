// routesStore.js
type TUrlModule = 'auth' | 'admin' | 'loci' | 'fauna' | 'stones' | ''
type TModule = 'Home' | 'Auth' | 'Admin' | 'Locus' | 'Fauna' | 'Stone'
type TRoutingError = {}
type TParsingError = 'BadModuleName' | 'BadIdFormat' | 'BadActionName' | 'BadQueryParams'
type TUrlAction = 'welcome' | 'filter' | 'index' | 'create' | 'update' | 'tags' | 'media'

type TRouteInfo = {
    url_module: TUrlModule | null,
    url_action: TUrlAction | null,
    url_id: string | null,
    url_query_params: object | null,
    module: TModule | null,
    action: string | null,
    idParams: object | null,
    queryParams: object | null
}

type TParseResponse = {
    success: boolean,
    data: TRouteInfo | TParsingError
}
export  { TUrlModule, TModule, TRouteInfo, TParseResponse, TParsingError }