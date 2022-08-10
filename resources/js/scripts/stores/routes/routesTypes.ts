// routesStore.js
type TUrlModel = 'auth' | 'admin' | 'loci' | 'fauna' | 'stones' | ''
type TModel = 'Home' | 'Auth' | 'Admin' | 'Locus' | 'Fauna' | 'Stone'
type TRoutingError = {}
type TParsingError = 'BadModelName' | 'BadIdFormat' | 'BadActionName'

type TRouteInfo = {
    url_model: TUrlModel | null,
    url_id: string | null,
    url_action: string | null,
    url_query_params: string | null,
    model: TModel | null,
    id_params: object | null,
    id_db: number | null
}

type TParseResponse = {
    success : boolean,
    data: TRouteInfo | TParsingError
}
export { TUrlModel, TModel, TRouteInfo, TParseResponse, TParsingError}