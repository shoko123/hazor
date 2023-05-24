type TItemMandatoryFields = {
        id: number
}

type TLocusFields = TItemMandatoryFields & {
        area: string
        name: string,
        square: string,
        elevation: string,
        type: string,
        stratum: string,
        cross_ref: string,
}
type TLocusField = keyof TLocusFields

type TLocusFieldsToStore = {
        area: string,
        name: string,
        square: string,
        elevation: string,
        type: string,
        stratum: string,
        cross_ref: string,
}

type TStoneFields = TItemMandatoryFields & {
        area: string,
        locus: string,
        basket: string,
        date: string,
        prov_notes: string,
        type: string,
        material_code: string,
        details: string,
        dimensions: string,
        material_id: number,
        base_type_id: number,
}
type TStoneField = keyof TStoneFields

type TStoneFieldsToStore = {
        area: string,
        locus: string,
        basket: string,
        date: string,
        prov_notes: string,
        type: string,
        material_code: string,
        details: string,
        dimensions: string,
}

type TFaunaFields = TItemMandatoryFields & {
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
        taxon_id: string
        element_id: string
}
type TFaunaField = keyof TFaunaFields

type TFaunaFieldsToStore = {
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
        snippet: string
}

type TFakeModuleFields = TItemMandatoryFields
type TFields = TLocusFields | TStoneFields | TFaunaFields | TFakeModuleFields
type TFieldsToStore = TStoneFieldsToStore | TLocusFieldsToStore | TFaunaFieldsToStore
type TColumnName =  TLocusField | TStoneField | TFaunaField
export {
        TItemMandatoryFields,
        TLocusFields,
        TLocusFieldsToStore,
        TStoneFields,
        TStoneFieldsToStore,
        TFaunaFields,
        TFaunaFieldsToStore,
        TFields,
        TFieldsToStore,
        TColumnName
}