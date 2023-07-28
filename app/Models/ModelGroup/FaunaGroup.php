<?php

namespace App\Models\ModelGroup;

use App\Models\Interfaces\ModelGroupInterface;
use App\Models\ModelGroup\ModelGroup;

require_once 'global_tag_groups.php';

class FaunaGroup  extends ModelGroup implements ModelGroupInterface
{
    static private $model_groups = [
        "Base Taxon" => [
            "group_type_code" => "CL",
            "table_name" => "fauna_taxa",
            "column_name" => "taxon_id",
        ],
        "Element" => [
            "group_type_code" => "CL",
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
            "dependency" => ["Base Taxon.Bird"],
            "multiple" => true
        ],
        "Mammal" => [
            "group_type_code" => "TM",
            "dependency" => ["Base Taxon.Mammal"],
            "multiple" => true
        ],
        "Fusion" => [
            "group_type_code" => "TM",
            "dependency" => ["Element.Bone"],
            "multiple" => true
        ],
        "Breakage" => [
            "group_type_code" => "TM",
            "dependency" => ["Element.Bone"],
            "multiple" => true
        ],
        "D&R (Grant 1982)" => [
            "group_type_code" => "TM",
            "dependency" => ["Element.Bone"],
            "multiple" => true
        ],
        "Bone Name" => [
            "group_type_code" => "TM",
            "dependency" => ["Element.Bone"],
            "multiple" => true
        ],
        "Tooth Name" => [
            "group_type_code" => "TM",
            "dependency" => ["Element.Tooth"],
            "multiple" => true
        ],
        "Tooth Age" => [
            "group_type_code" => "TM",
            "dependency" => ["Element.Tooth"],
            "multiple" => true
        ],
        "Tooth Wear" => [
            "group_type_code" => "TM",
            "dependency" => ["Element.Tooth"],
            "multiple" => true
        ],
        "Order By" => [
            "group_type_code" => "OB",
            "options" => [
                ["name" => "Area", "column_name" => "area"],
                ["name" => "Locus", "column_name" => "locus"],
                ["name" => "Basket", "column_name" => "basket"],
                ["name" => "Label", "column_name" =>  "label"],
            ],
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
            "Basic Characteristics" => [
                "Life Stage",
                "Symmetry",
                "Weathering (Behrensmeyer 1978)"
            ],
            "Taxon" => [
                "Base Taxon",
                "Bird",
                "Mammal"
            ],
            "Element" => [
                "Element"
            ],
            "Bone" =>  [
                "Fusion",
                "Breakage",
                "D&R (Grant 1982)",
                "Bone Name"
            ],
            "Tooth" => [
                "Tooth Name",
                "Tooth Age",
                "Tooth Wear"
            ],
            "Order By" => [
                "Order By",
            ]            
        ];

        return $this->buildTrio($cats);
    }
}
