<?php

namespace App\Models\ModelGroup;

use App\Models\Interfaces\ModelGroupInterface;
use App\Models\ModelGroup\ModelGroup;

require_once 'global_tag_groups.php';

class StoneGroup extends ModelGroup implements ModelGroupInterface
{
    static private $model_groups = [
        "Area" => [
            "group_type_code" => "CR",
            "table_name" => "stones",
            "column_name" => "area"
        ],
        "Material" => [
            "group_type_code" => "CL",
            "table_name" => "stone_materials",
            "column_name" => "material_id",
        ],
        "Basic Typology" => [
            "group_type_code" => "CL",
            "table_name" => "stone_base_types",
            "column_name" => "base_type_id"
        ],
        "Life Stage" => [
            "group_type_code" => "TM",
            "dependency" => null,
            "multiple" => true
        ],
        "Morphology" => [
            "group_type_code" => "TM",
            "dependency" => null,
            "multiple" => true
        ],
        "Profile" => [
            "group_type_code" => "TM",
            "dependency" => null,
            "multiple" => true
        ],
        "Production" => [
            "group_type_code" => "TM",
            "dependency" => null,
            "multiple" => true
        ],
        "Use Wear" => [
            "group_type_code" => "TM",
            "dependency" => null,
            "multiple" => true
        ],
        "Passive Subtype" => [
            "group_type_code" => "TM",
            "dependency" => ["Basic Typology.Passive"],
            "multiple" => true
        ],
        "Active Subtype" => [
            "group_type_code" => "TM",
            "dependency" => ["Basic Typology.Active (handheld)"],
            "multiple" => true
        ],
        "Vessel Type" => [
            "group_type_code" => "TM",
            "dependency" => ["Basic Typology.Vessel"],
            "multiple" => true
        ],
        "Vessel Part" => [
            "group_type_code" => "TM",
            "dependency" => ["Basic Typology.Vessel"],
            "multiple" => true
        ],
        "Vessel Base" => [
            "group_type_code" => "TM",
            "dependency" => ["Vessel Part.Base"],
            "multiple" => true
        ],
        "Vessel Wall" => [
            "group_type_code" => "TM",
            "dependency" => ["Vessel Part.Wall"],
            "multiple" => true
        ],
        "Vessel Rim" => [
            "group_type_code" => "TM",
            "dependency" => ["Vessel Part.Rim"],
            "multiple" => true
        ],
        "Non-Processor Subtype" => [
            "group_type_code" => "TM",
            "dependency" => ["Basic Typology.Non-Processor"],
            "multiple" => true
        ],
        "Search-Area" => [
            "group_type_code" => "CS",
            "column_name" => "area",
        ],
        "Search-Locus" => [
            "group_type_code" => "CS",
            "column_name" => "locus",
        ],
        "Search-Basket" => [
            "group_type_code" => "CS",
            "column_name" => "basket",
        ],
        "Search-Year" => [
            "group_type_code" => "CS",
            "column_name" => "year",
        ],
        "Search-Description" => [
            "group_type_code" => "CS",
            "column_name" => "description",
        ],
        "Search-Notes" => [
            "group_type_code" => "CS",
            "column_name" => "notes",
        ],
        "Order By" => [
            "group_type_code" => "OB",
            "options" => [
                ["name" => "Area", "column_name" => "area"],
                ["name" => "Locus", "column_name" => "locus"],
                ["name" => "Basket", "column_name" => "basket"],
                ["name" => "Stone No.", "column_name" => "stone_no"],
                ["name" => "Year", "column_name" =>  "year"],
                ["name" => "Material", "column_name" => "material_id"],
                ["name" => "Base Typology", "column_name" =>  "base_type_id"]
            ],
        ],
    ];

    public function __construct()
    {
        ModelGroup::__construct('Stone');
        self::$groups = array_merge(self::$model_groups, globalGroups());
    }

    public static function getModelGroups(): array
    {
        return array_merge(globalGroups(), self::$groups);
    }

    public function trio(): array
    {
        $cats = [
            "Search" => [
                "Search-Basket",
                "Search-Locus",
                "Search-Year",
                "Search-Description",
                "Search-Notes"
            ],
            "Registration" => [
                "Area",
                "Media"
            ],
            "Periods" => [
                "Periods (Top-Level)",
                "Neolithic Subperiods",
                "Bronze Subperiods",
                "Iron Subperiods",
                "Hellenistic Subperiods",
                "Roman Subperiods",
                "Early-Islamic Subperiods",
                "Medieval Subperiods",
                "Modern Subperiods"
            ],
            "Basic Characteristics" => [
                "Material",
                "Life Stage",
                "Use Wear",
                "Morphology",
                "Profile",
                "Production",
                "Basic Typology"
            ],
            "Typology" => [
                "Vessel Type",
                "Passive Subtype",
                "Active Subtype",
                "Vessel Part",
                "Vessel Base",
                "Vessel Wall",
                "Vessel Rim",
                "Non-Processor Subtype"
            ],
            "Order By" => [
                "Order By",
            ]
        ];

        return $this->buildTrio($cats);
    }
}
