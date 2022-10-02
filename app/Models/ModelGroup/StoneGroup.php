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
            "dependency" => null,
            "multiple" => true
        ],
        "Active Subtype" => [
            "group_type_code" => "TM",
            "dependency" => null,
            "multiple" => true
        ],
        "Vessel Part" => [
            "group_type_code" => "TM",
            "dependency" => null,
            "multiple" => true
        ],
        "Vessel Base" => [
            "group_type_code" => "TM",
            "dependency" => null,
            "multiple" => true
        ],
        "Vessel Wall" => [
            "group_type_code" => "TM",
            "dependency" => null,
            "multiple" => true
        ],
        "Vessel Rim" => [
            "group_type_code" => "TM",
            "dependency" => null,
            "multiple" => true
        ],
        "Non-Processor Subtype" => [
            "group_type_code" => "TM",
            "dependency" => null,
            "multiple" => true
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
            "Registration" => [
                ["Areas"],
            ],
            "Periods" => [
                ["Periods (Top-Level)", "Neolithic Subperiods", "Bronze Subperiods"],
            ],
            "Basic Charectaristics" => [
                ["Material", "Life Stage", "Morphology", "Profile", "Production", "Profile", "Basic Typology"]
            ],
            "Typology" => [
                ["Passive Subtype", "Active Subtype", "Vessel Part", "Vessel Base", "Vessel Wall", "Vessel Rim", "Non-Processor Subtype"],
            ]
        ];

        return $this->buildTrio($cats);
    }
}
