<?php

namespace App\Models\ModelGroup;

use App\Models\Interfaces\ModelGroupInterface;
use App\Models\ModelGroup\ModelGroup;

require_once 'global_tag_groups.php';

class StoneGroup extends ModelGroup implements ModelGroupInterface
{
    static private $model_groups = [
        "Material" => [
            "group_type_code" => "LV",
            "table_name" => "stone_materials",
            "column_name" => "material_id",
        ],
        "Basic Typology" => [
            "group_type_code" => "LV",
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
        "Search-Details" => [
            "group_type_code" => "CS",
            "column_name" => "details",
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

    public static function getModelGroupNames(): array
    {
        return array_keys(self::$groups);
    }

    public function trio(): array
    {
        $cats = [
            "Search" => [
                [
                    "Search-Basket",
                    "Search-Locus",
                    "Search-Year",                    
                    "Search-Details",
                ]
            ], 
            "Registration" => [
                [
                    "Media"
                ],
            ],
            "Periods" => [
                [
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
            ],
            "Basic Characteristics" => [
                [
                    "Material",
                    "Life Stage",
                    "Use Wear",
                    "Morphology",
                    "Profile",
                    "Production",
                    "Basic Typology"
                ]
            ],
            "Typology" => [
                [
                    "Passive Subtype",
                    "Active Subtype",
                    "Vessel Part",
                    "Vessel Base",
                    "Vessel Wall",
                    "Vessel Rim",
                    "Non-Processor Subtype"
                ],
            ]
        ];

        return $this->buildTrio($cats);
    }
}
