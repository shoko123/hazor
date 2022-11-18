//itemTypes.ts

type TLocusFields = {
        id: number,
        name: string,
        type: string,
        stratum: string,
        square: string,
        elevation: string,
        cross_ref: string,
}

type TStoneFields = {
        id: number,
        material_id: number,
        base_type_id: number,
        type: string,
        area: string,
        date: string,
        basket: string,
        locus: string,
        prov_notes: string,
        material: string,
        dimensions: string,
        details: string,
}
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
        taxon_id: string
        element_id: string
}
type TItemFields = TLocusFields | TFaunaFields | TStoneFields | undefined

export { TItemFields, TLocusFields, TStoneFields, TFaunaFields }