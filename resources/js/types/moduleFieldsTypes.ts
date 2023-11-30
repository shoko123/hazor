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
type TLocusModify = keyof Pick<TLocusFields, 'id' | 'name' | 'area' | 'locus_no' |'stratum' | 'year' | 'square' |  'addendum' | 'type' | 'cross_ref' | 'description' | 'notes' >
type TLocusLookup = keyof Pick<TLocusFields, 'id' >

type TLocusField = keyof TLocusFields
type TLocusModifyFields = keyof TLocusModify
type TLocusLookupFields = keyof TLocusLookup


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
type TStoneModify = keyof Pick<TStoneFields, 'id' | 'area' | 'locus' |'basket' | 'stone_no' | 'date' |  'year' | 'prov_notes' | 'type' | 'material_code' | 'dimensions' | 'rim_diameter' | 'description' | 'notes' | 'publication'>
type TStoneLookup = keyof Pick<TStoneFields, 'id' |'material_id' | 'base_type_id' >

type TStoneField = keyof TStoneFields
type TStoneModifyFields = keyof TStoneModify
type TStoneLookupFields = keyof TStoneLookup

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

type TFaunaField = keyof TFaunaFields
type TFaunaModifyField = keyof TFaunaModify
type TFaunaLookupField = keyof TFaunaLookup

type TFields = TLocusFields | TStoneFields | TFaunaFields
type TModify = TLocusModify | TStoneModify | TFaunaModify
type TLookup = TLocusLookup | TStoneLookup | TFaunaLookup

type TColumnName = TLocusField | TStoneField | TFaunaField
export {
        TLocusFields,
        TStoneFields,
        TFaunaFields,
        TFields,
        TModify,
        TLookup,
        TColumnName
}