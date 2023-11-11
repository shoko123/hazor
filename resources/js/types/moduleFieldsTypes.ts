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

type TLocusField = keyof TLocusFields

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

type TStoneField = keyof TStoneFields

type TFaunaFields = {
        id: number,
        uri: string,
        diagnostic: boolean,
        label: string,
        area: string,
        locus: string,
        basket: string,
        stratum: string,
        registration_clean: boolean,
        base_taxon_id: number,
        taxon: string,
        taxon_common_name: string,
        fragment_present: string,
        symmetry: string,
        fusion_proximal: string,
        fusion_distal: string,
        base_element_id: number,
        anatomical_label: string,
        element: string,
        age: string,
        phase: string,
        modifications: string,
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