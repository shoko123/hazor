// collectionTypes.ts

import { TMediaOfItem, TMediaRecord, TMediaUrls, TPageMedia } from '@/js/types/mediaTypes'
import { TModule } from '@/js/types/routesTypes'

type TCollectionView = 'Gallery' | 'Chips' | 'Tabular'
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
type TApiPageMainGallery = {
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
        slug: string,
        label: string,
        area: string,
        locus: string,
        basket: string,
        registration_clean: boolean,
        scope: string,
        base_taxon: string,
        taxon: string,
        fragment_present: string,
        material: string,
        symmetry: string,
        anatomical_label: string,
        modifications: string,
}

type TApiPage = TApiPageMainGallery |
        TApiArrayMain |
        TApiPageTableLocus |
        TApiPageTableStone |
        TApiPageTableFauna

//conversions ready for consumption for 'Gallery', 'Chips', and 'Tabular' views
type TPageMainChips = {
        id: number,
        slug: string,
        tag: string,
}

type TPageRelatedChips = TPageMainChips & {
        module: TModule,
}

type TPageChips = TPageMainChips | TPageRelatedChips

type TPageMainGallery = {
        id: number,
        slug: string,
        tag: string,
        short: string
        media: TMediaOfItem
}

type TPageRelatedGallery = {
        relation_name: string,
        module: TModule,
        id: number,
        slug: string,
        tag: string
        short: string,
        media: TMediaOfItem
}

type TPageRelatedTabular = {
        relation_name: string,
        module: TModule,
        id: number,
        slug: string,
        tag: string
        short: string,
}



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

type TItemsPerView = { [key in TCollectionView]: number; }

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
        TApiPageMainGallery,
        TApiPage,
        TPageMainChips,
        TPageRelatedChips,
        TPageChips,
        TPageMainGallery,
        TPageRelatedGallery,
        TPageRelatedTabular,
        TMediaUrls,
        TItemsPerView,
}