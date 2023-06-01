
<?php
function globalGroups()
{
    return [
        "Area" => [
            "group_type_code" => "BF",
            "params"  => ["A1", "A2", "A3", "A4", "A5"]
        ],
        "Media" => [
            "group_type_code" => "BF",
            "params"  => ["Photo", "Drawing", "Photo and Drawing", "Plan", "Misc"]
        ],
        "Scope" => [
            "group_type_code" => "BF",
            "params"  => ["Basket", "Artifact"]
        ],
        "Periods (Top-Level)" => [
            "group_type_code" => "TG",
            "dependency" => null
        ],
        "Neolithic Subperiods" => [
            "group_type_code" => "TG",
            "dependency" => ["Periods (Top-Level).Neolithic"],
        ],
        "Bronze Subperiods" => [
            "group_type_code" => "TG",
            "dependency" => ["Periods (Top-Level).Bronze"],
        ],
        "Iron Subperiods" => [
            "group_type_code" => "TG",
            "dependency" => ["Periods (Top-Level).Iron"],
        ],
        "Hellenistic Subperiods" => [
            "group_type_code" => "TG",
            "dependency" => ["Periods (Top-Level).Hellenistic"],
        ],
        "Roman Subperiods" => [
            "group_type_code" => "TG",
            "dependency" => ["Periods (Top-Level).Roman"],
        ],
        "Early-Islamic Subperiods" => [
            "group_type_code" => "TG",
            "dependency" => ["Periods (Top-Level).Early Islamic"],
        ],
        "Medieval Subperiods" => [
            "group_type_code" => "TG",
            "dependency" =>  ["Periods (Top-Level).Medieval"],
        ],
        "Modern Subperiods" => [
            "group_type_code" => "TG",
            "dependency" =>  ["Periods (Top-Level).Modern"],
        ],
    ];
}