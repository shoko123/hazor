// routesStore.js
type TName = 'home' | 'welcome' | 'filter' | 'index' | 'create' | 'update' | 'tags' | 'media'
type TUrlModule = 'auth' | 'admin' | 'loci' | 'fauna' | 'stones' | ''
type TModule = 'Home' | 'Auth' | 'Admin' | 'Locus' | 'Fauna' | 'Stone'
type TRoutingError = {}
type TParsingError = 'BadModuleName' | 'BadIdFormat' | 'BadQueryParams'


type TRouteInfo = {
    url_module: TUrlModule | null,
    url_id: string | null,
    url_query_params: object | null,
    name: TName,    
    module: TModule | null,
    idParams: object | null,
    queryParams: object | null
}

type TParseResponse = {
    success: boolean,
    data: TRouteInfo | TParsingError
}
export  { TName, TUrlModule, TModule, TRouteInfo, TParseResponse, TParsingError }