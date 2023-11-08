// collectionTypes.ts

import { TMediaOfItem, TMediaRecord, TMediaUrls, TPageCMedia } from '@/js/types/mediaTypes'
import { TModule } from '@/js/types/routesTypes'

type TCollectionView = 'Image' | 'Chip' | 'Table'
type TCollectionName = 'main' | 'media' | 'related'

type TCView = { name: TCollectionView, ipp: number }

//array types
type TApiArrayMain = { id: number, slug: string }
type TApiArrayMedia = TMediaRecord
type TApiArrayRelated = {
        relation_name: string,
        module: TModule,
        id: number,
        slug: string,
        short: string,
        media: TMediaUrls
}

type TApiArray = TApiArrayMain | TApiArrayMedia | TApiArrayRelated

//page types (divided into ApiPageX and PageX groups)

//Api page types
type TApiPageMainImage = {
        id: number,
        slug: string,
        short: string,
        media1: TMediaUrls | null
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
        diagnostic: boolean,
        slug: string,
        label: string,
        area: string,
        locus: string,
        basket: string,
        registration_clean: boolean,
        base_taxon: string,
        taxon: string,
        fragment_present: string,
        base_element: string,
        symmetry: string,
        anatomical_label: string,
        modifications: string,
}


type TApiPageMainTable = {
        id: number,
        slug: string,
        tag: string,
        description: string,
}

type TApiPage = TApiPageMainImage |
        TApiPageMainTable |
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
        short: string
        media: TMediaOfItem
}

type TPageCMainVTable = {
        id: number,
        slug: string,
        tag: string
        //description: string
}

type TPageMainTabularLocus = {
        id: number,
        slug: string,
        tag: string
        //description: string
}

type TPageCRelatedVMedia = {
        relation_name: string,
        module: TModule,
        id: number,
        slug: string,
        tag: string
        short: string,
        media: TMediaOfItem
}

type TPageCRelatedVTable = {
        relation_name: string,
        module: TModule,
        id: number,
        slug: string,
        tag: string
        short: string,
}

type TPageCRelatedVChip = {
        module: TModule,
        id: number,
        slug: string,
        tag: string
}
//union of the above
type TPageItem = TPageCMainVImage | TPageCMainVTable | TPageVChip | TPageCMedia | TPageCRelatedVMedia | TPageCRelatedVChip

//internal collection data
type TCollectionExtra = {
        length: number,
        pageNoB1: number,
        views: TCView[],
        viewIndex: number,
}

type TCollectionMeta = {
        views: TCView[],
        viewIndex: number,
        view: TCView,
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
        TCView,
        TCollectionExtra,
        TCollectionMeta,
        TApiArrayMain,
        TApiArrayMedia,
        TApiArrayRelated,
        TApiArray,
        TApiPageMainImage,
        TApiPageMainTable,
        TApiPageTableLocus,
        TApiPage,
        TPageVChip,
        TPageCMainVImage,
        TPageCMainVTable,
        TPageCRelatedVMedia,
        TPageCRelatedVTable,
        TPageCRelatedVChip,
        TPageItem,
        TMediaUrls,
}