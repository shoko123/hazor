
<?php

use App\Models\Functional\MediaModel;
function globalGroups()
{
    return [
        "Media" => [
            "group_type_code" => "BF",
            "params"  => MediaModel::media_collections()
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