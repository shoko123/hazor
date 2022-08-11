// routesStore.js
type TUrlModel = 'auth' | 'admin' | 'loci' | 'fauna' | 'stones' | ''
type TModel = 'Home' | 'Auth' | 'Admin' | 'Locus' | 'Fauna' | 'Stone'
type TRoutingError = {}
type TParsingError = 'BadModelName' | 'BadIdFormat' | 'BadActionName'
type TUrlAction = 'welcome' | 'filter' | 'index' | 'create' | 'update' | 'tags' | 'media'

type TRouteInfo = {
    url_model: TUrlModel | null,
    url_action: TUrlAction | null,
    url_id: string | null,
    url_query_params: object | null,
    model: TModel | null,
    action: string | null,
    idParams: object | null,
    queryParams: object | null
}

type TParseResponse = {
    success: boolean,
    data: TRouteInfo | TParsingError
}
export  { TUrlModel, TModel, TRouteInfo, TParseResponse, TParsingError }