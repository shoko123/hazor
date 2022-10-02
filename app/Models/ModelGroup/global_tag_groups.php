
<?php
function globalGroups()
{
    return [
        "Areas" => [
            "group_type_code" => "CV",
            "table_name" => "loci",
            "column_name" => "area"
        ],
        "Periods (Top-Level)" => [
            "group_type_code" => "TG",
            "dependency" => null
        ],
        "Neolithic Subperiods" => [
            "group_type_code" => "TG",
            "dependency" => [["TG.10300"]],
        ],
        "Bronze Subperiods" => [
            "group_type_code" => "TG",
            "dependency" => null
        ],
        "Iron Subperiods" => [
            "group_type_code" => "TG",
            "dependency" => [["TG.10300"]],
        ],
        "Hellenistic Subperiods" => [
            "group_type_code" => "TG",
            "dependency" => null
        ],
        "Roman Subperiods" => [
            "group_type_code" => "TG",
            "dependency" => [["TG.10300"]],
        ],
        "Early-Islamic Subperiods" => [
            "group_type_code" => "TG",
            "dependency" => null
        ],
        "Medieval Subperiods" => [
            "group_type_code" => "TG",
            "dependency" => [["TG.10300"]],
        ],
        "Modern Subperiods" => [
            "group_type_code" => "TG",
            "dependency" => [["TG.10300"]],
        ],
    ];
}