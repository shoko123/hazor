<?php

namespace App\Models\ModelGroup;

use App\Models\Interfaces\ModelGroupInterface;
use App\Models\ModelGroup\ModelGroup;

require_once 'global_tag_groups.php';

class FaunaGroup  extends ModelGroup implements ModelGroupInterface
{
    static private $model_groups = [
        "Base Taxon" => [
            "group_type_code" => "LV",
            "table_name" => "fauna_taxa",
            "column_name" => "taxon_id",
        ],
        "Element" => [
            "group_type_code" => "LV",
            "table_name" => "fauna_elements",
            "column_name" => "element_id"
        ],
        "Life Stage" => [
            "group_type_code" => "TM",
            "dependency" => null,
            "multiple" => true
        ],
        "Symmetry" => [
            "group_type_code" => "TM",
            "dependency" => null,
            "multiple" => true
        ],
        "Weathering (Behrensmeyer 1978)" => [
            "group_type_code" => "TM",
            "dependency" => null,
            "multiple" => true
        ],
        "Bird" => [
            "group_type_code" => "TM",
            "dependency" => null,
            "multiple" => true
        ],
        "Mammal" => [
            "group_type_code" => "TM",
            "dependency" => null,
            "multiple" => true
        ],
        "Fusion" => [
            "group_type_code" => "TM",
            "dependency" => null,
            "multiple" => true
        ],
        "Breakage" => [
            "group_type_code" => "TM",
            "dependency" => null,
            "multiple" => true
        ],
        "D&R (Grant 1982)" => [
            "group_type_code" => "TM",
            "dependency" => null,
            "multiple" => true
        ],
        "Bone Name" => [
            "group_type_code" => "TM",
            "dependency" => null,
            "multiple" => true
        ],
        "Tooth Name" => [
            "group_type_code" => "TM",
            "dependency" => null,
            "multiple" => true
        ],
        "Tooth Age" => [
            "group_type_code" => "TM",
            "dependency" => null,
            "multiple" => true
        ],
        "Tooth Wear" => [
            "group_type_code" => "TM",
            "dependency" => null,
            "multiple" => true
        ],


    ];

    public function __construct()
    {
        ModelGroup::__construct('Fauna');
        self::$groups = array_merge(self::$model_groups, globalGroups());
    }

    public static function getModelGroups(): array
    {
        return self::$model_groups;
    }

    public static function getModelGroupNames(): array
    {
        return array_keys(self::$model_groups);
    }


    public function trio(): array
    {
        $cats = [
            "Registration" => [
                ["Areas"]
            ],
            "Basic Characteristics" => [
                ["Life Stage", "Symmetry", "Weathering (Behrensmeyer 1978)"],
            ],
            "Taxon" => [
                ["Base Taxon", "Bird", "Mammal"],
            ],
            "Element" => [
                ["Element"],
            ],
            "Bone" => [
                ["Fusion", "Breakage", "D&R (Grant 1982)", "Bone Name"],
            ],
            "Tooth" => [
                ["Tooth Name", "Tooth Age", "Tooth Wear"],
            ]
        ];

        return $this->buildTrio($cats);
    }
}
