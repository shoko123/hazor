// collectionTypes.ts

import { TMedia, TApiMedia, TApiMediaOrNull } from '@/js/types/mediaTypes'
import { TModule } from '@/js/types/routesTypes'

type TCollectionView = 'Image' | 'Chip' | 'Table'
type TCollectionName = 'main' | 'media' | 'related'

type TItemPerPagePerView = { Image: number, Chip: number, Table: number }

//array types
type TApiArrayMain = { id: number, slug: string }
type TApiArrayMedia = number
type TApiArrayRelated = { module: TModule, id: number, slug: string }

type TApiArray = TApiArrayMain | TApiArrayMedia | TApiArrayRelated

//page types (divided into ApiPageX and PageX groups)

//Api page types
type TApiPageMainImage = {
        id: number,
        slug: string,
        description: string,
        media1: TApiMediaOrNull
}

type TApiPageTableLocus = {
        id: number,
        slug: string,
        year: number,
        square: string,
        stratum: string,
        type: string,
        cross_ref: string,
        description: string,
        notes: string,
        elevation: string,
}

type TApiPageTableStone = {
        id: number,
        slug: string,//basket.stone_no
        date: string,
        year: number,
        prov_notes: string,
        type: string,
        material_code: string,
        dimensions: string,
        rim_diameter: string,
        description: string,
        notes: string,
        publication: string,
        material: string,
        base_type: string,
}

type TApiPageTableFauna = {
        id: number,
        slug: string,
        label: string,
        area: string,
        locus: string,
        basket: string,
        item_category: string,
        biological_taxonomy: string,
        has_taxonomic_identifier: string,
        has_anatomical_identifier: string,
        stratum: string,
        taxon: string,
        element: string,
        fragment_present: string,
        bone_number: string,
        snippet: string,
}

type TApiPageMainTable = {
        id: number,
        slug: string,
        tag: string,
        description: string,
}

type TApiPageMedia = TApiMedia & { id: number, description: string }

type TApiPage = TApiPageMainImage |
        TApiPageMainTable |
        TApiPageMedia |
        TApiArrayMain |
        TApiPageTableLocus |
        TApiPageTableStone |
        TApiPageTableFauna

//conversions ready for consumption for 'Media', 'Chip', and 'Table' views

type TPageVChip = {
        id: number,
        slug: string,
        tag: string,
}

type TPageCMainVImage = {
        id: number,
        slug: string,
        tag: string,
        description: string
        media: TMedia
}

type TPageCMainVTable = {
        id: number,
        slug: string,
        tag: string
        description: string
}

type TPageCMediaVImage = {
        id: number,
        media: TMedia,
        tag: string,
        description: string
}

//union of the above
type TPageItem = TPageCMainVImage | TPageCMainVTable | TPageVChip | TPageCMediaVImage

//internal collection data
type TCollectionExtra = {
        length: number,
        pageNoB1: number,
        views: TCollectionView[],
        viewIndex: number,
}

type TCollectionMeta = {
        views: TCollectionView[],
        viewIndex: number,
        view: TCollectionView,
        itemsPerPage: number,
        pageNoB1: number,
        noOfItems: number,
        noOfPages: number,
        noOfItemsInCurrentPage: number,
        firstItemNo: number,
        lastItemNo: number,
        length: number
}

export {
        TCollectionName,
        TCollectionView,
        TItemPerPagePerView,
        TCollectionExtra,
        TCollectionMeta,
        TApiArrayMain,
        TApiArrayMedia,
        TApiArrayRelated,
        TApiArray,
        TApiPageMainImage,
        TApiPageMainTable,
        TApiPageTableLocus,
        TApiPageMedia,
        TApiPage,
        TPageVChip,
        TPageCMainVImage,
        TPageCMainVTable,
        TPageCMediaVImage,
        TPageItem,
        TApiMedia,
        TApiMediaOrNull
}