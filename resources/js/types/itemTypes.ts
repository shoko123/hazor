//itemTypes.ts
type TItemMandatoryFields = {
        id: number
}

type TLocusFields = TItemMandatoryFields & {
        name: string,
        type: string,
        stratum: string,
        square: string,
        elevation: string,
        cross_ref: string,
    }

type TStoneFields = TItemMandatoryFields & {
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
type TFaunaFields = TItemMandatoryFields & {
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

type TItemDerived = {
        tag: string,
        
}
export { TItemMandatoryFields, TLocusFields, TStoneFields, TFaunaFields }