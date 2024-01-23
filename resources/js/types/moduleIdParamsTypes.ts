type TLocusSlugParams = {
        area: string,
        name: string
}

type TLocusIdParams = {
        id: number,
        tag: string
        area: string,
        name: string,
        locus_no: number,
        addendum: string,
}

type TLocusIdParam = keyof TLocusIdParams

type TStoneSlugParams = {
        basket: string,
        stone_no: number
}

type TStoneIdParams = {
        id: number,
        tag: string,
        area: string,
        locus: string,
        basket: string,
        stone_no: number,
}

type TStoneIdParam = keyof TStoneIdParams

type TFaunaSlugParams = {
        label: string
}

type TFaunaIdParams = {
        id: number,
        tag: string,
        label: string,
        area: string,
        locus: string,
        basket: string,
}
type TFaunaIdParam = keyof TFaunaIdParams

type TIdParams = TLocusIdParams | TStoneIdParams | TFaunaIdParams
type TIdParam = TLocusIdParam | TStoneIdParam | TFaunaIdParam
type TSlugParams = TLocusSlugParams | TStoneSlugParams | TFaunaSlugParams

export {
        TLocusIdParams,
        TLocusSlugParams,
        TStoneIdParams,
        TStoneSlugParams,
        TFaunaIdParams,
        TFaunaSlugParams,
        TSlugParams,
        TIdParams,
        TIdParam
}