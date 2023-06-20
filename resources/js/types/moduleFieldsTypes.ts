type TLocusFields =  {
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

type TLocusField = keyof TLocusFields

type TStoneFields = {
        id: number,
        area: string,
        locus: string,
        basket: string,
        year: number | null,
        date: string,
        prov_notes: string,
        type: string,
        material: string,
        details: string,
        dimensions: string,
        material_id: number,
        base_type_id: number,
}
type TStoneField = keyof TStoneFields

type TFaunaFields = {
        id: number,
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
        taxon_id: number
        element_id: number
}
type TFaunaField = keyof TFaunaFields

type TFields = TLocusFields | TStoneFields | TFaunaFields
type TColumnName = TLocusField | TStoneField | TFaunaField
export {
        TLocusFields,
        TStoneFields,
        TFaunaFields,
        TFields,
        TColumnName
}