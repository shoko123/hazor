import type { TApiTrio } from '@/js/types/trioTypes'
import type { TCollectionView } from '@/js/types/collectionTypes'

type TModuleTypes = {
        url: 'loci',
        name: 'Locus',
        fields: TLocusFields,
        modify: TLocusModify,
        lookups: TLocusLookup
} | {
        url: 'stones',
        name: 'Stone',
        fields: TStoneFields,
        modify: TStoneModify,
        lookups: TStoneLookup
} | {
        url: 'fauna',
        name: 'Fauna',
        fields: TFaunaFields,
        modify: TFaunaModify,
        lookups: TFaunaLookup
}

type TModule = TModuleTypes['name']
type TUrlModule = TModuleTypes['url']

type TFieldsUnion = TModuleTypes['fields']
type TFieldsGeneric<TM extends TModule> = Extract<TModuleTypes, { name: TM }>['fields']

type TLocusFields = {
        id: number,
        name: string,
        area: string,
        locus_no: number,
        addendum: string | null,
        year: number | null,
        square: string,
        stratum: string,
        type: string,
        cross_ref: string,
        description: string,
        notes: string
        elevation: string,
}
type TLocusModify = keyof Pick<TLocusFields, 'id' | 'name' | 'area' | 'locus_no' | 'stratum' | 'year' | 'square' | 'addendum' | 'type' | 'cross_ref' | 'description' | 'notes'>
type TLocusLookup = keyof Pick<TLocusFields, 'id'>

type TStoneFields = {
        id: number,
        area: string,
        locus: string,
        basket: string,
        stone_no: number,
        date: string | null,
        year: number | null,
        prov_notes: string | null,
        type: string | null,
        material_code: string | null,
        dimensions: string | null,
        rim_diameter: number | null,
        description: string | null,
        notes: string | null,
        publication: string | null,
        material_id: number,
        base_type_id: number,
        order_column: number | null
}
type TStoneModify = keyof Pick<TStoneFields, 'id' | 'area' | 'locus' | 'basket' | 'stone_no' | 'date' | 'year' | 'prov_notes' | 'type' | 'material_code' | 'dimensions' | 'rim_diameter' | 'description' | 'notes' | 'publication'>
type TStoneLookup = keyof Pick<TStoneFields, 'id' | 'material_id' | 'base_type_id'>

type TFaunaFields = {
        id: number,
        uri: string,
        label: string,
        area: string,
        locus: string,
        basket: string,
        stratum: string,
        registration_clean: number,

        taxon: string,
        taxon_common_name: string,
        base_taxon_id: number,

        fragment_present: string,
        anatomical_label: string,
        element: string,
        modifications: string,
        phase: string,
        age: string,

        scope_id: number,
        material_id: number,
        symmetry_id: number,
        fusion_proximal_id: number,
        fusion_distal_id: number,
}

type TFaunaModify = keyof Pick<TFaunaFields, 'id' | 'area' | 'locus' | 'basket' | 'stratum' | 'registration_clean' | 'taxon' | 'taxon_common_name' | 'fragment_present' | 'anatomical_label' | 'element' | 'modifications' | 'phase' | 'age'>
type TFaunaLookup = keyof Pick<TFaunaFields, 'id' | 'base_taxon_id' | 'scope_id' | 'material_id' | 'symmetry_id' | 'fusion_proximal_id' | 'fusion_distal_id'>

type TModify = TLocusModify | TStoneModify | TFaunaModify
type TLookup = TLocusLookup | TStoneLookup | TFaunaLookup

type TFuncValidateSlug = (slug: string) => { success: true, data: object, message: string } | { success: false, data: null, message: string }

type TApiModuleInit = {
        counts: { items: number, media: number },
        display_options: { item_views: string[], main_collection_views: TCollectionView[], related_collection_views: TCollectionView[] },
        lookups: { column_name: string, group_name: string }[],
        trio: TApiTrio,
        welcome_text: string
}
export {
        TModule,
        TUrlModule,
        TFieldsUnion,    
        TFieldsGeneric,
        TModify,
        TLookup,
        TApiModuleInit,
        TFuncValidateSlug
}