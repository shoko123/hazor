<?php

namespace App\Models\ModelGroup;

use App\Models\Interfaces\ModelGroupInterface;
use App\Models\ModelGroup\ModelGroup;

require_once 'global_tag_groups.php';

class FaunaGroup  extends ModelGroup implements ModelGroupInterface
{
    static private $model_groups = [
        "Search-Label" => [
            "group_type_code" => "CS",
            "column_name" => "label",
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
        "Search-Taxon" => [
            "group_type_code" => "CS",
            "column_name" => "taxon",
        ],
        "Search-Anatomical-Label" => [
            "group_type_code" => "CS",
            "column_name" => "anatomical_label",
        ],
        "Search-Element" => [
            "group_type_code" => "CS",
            "column_name" => "element",
        ],
        "Base Taxon" => [
            "group_type_code" => "CL",
            "table_name" => "fauna_base_taxa",
            "column_name" => "base_taxon_id",
        ],
        "Mammal" => [
            "group_type_code" => "TM",
            "dependency" => ["Base Taxon.Mammal"],
            "multiple" => true
        ],
        "Bird" => [
            "group_type_code" => "TM",
            "dependency" => ["Base Taxon.Bird"],
            "multiple" => true
        ],
        "Base Element" => [
            "group_type_code" => "CL",
            "table_name" => "fauna_base_elements",
            "column_name" => "base_element_id"
        ],
        "Symmetry" => [
            "group_type_code" => "TM",
            "dependency" => null,
            "multiple" => false
        ],
        "Modifications" => [
            "group_type_code" => "TM",
            "dependency" => ["Base Element.Bone"],
            "multiple" => true
        ],
        "Bone Name" => [
            "group_type_code" => "TM",
            "dependency" => ["Base Element.Bone"],
            "multiple" => true
        ],
        "Tooth Name" => [
            "group_type_code" => "TM",
            "dependency" => ["Base Element.Tooth"],
            "multiple" => true
        ],
        "Tooth Age" => [
            "group_type_code" => "TM",
            "dependency" => ["Base Element.Tooth"],
            "multiple" => true
        ],
        "Tooth Wear" => [
            "group_type_code" => "TM",
            "dependency" => ["Base Element.Tooth"],
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
            "Search" => [
                "Search-Label",
                "Search-Area",
                "Search-Locus",
                "Search-Basket",
                "Search-Taxon",
                "Search-Anatomical-Label",
            ],
            /*
             "Registration" => [
                "Diagnostic",
                "Registration Clean",
            ],
            */
            "Taxon" => [
                "Base Taxon",
                "Mammal",
                "Bird",
            ],
            "Element" => [
                "Base Element",
                "Symmetry",
                
            ],
            "Bone" =>  [
                "Bone Name",
                "Modifications",
            ],
            /*
            "Tooth" => [
                "Tooth Name",
                "Tooth Age",
                "Tooth Wear"
            ],
            */
            "Order By" => [
                "Order By",
            ]
        ];

        return $this->buildTrio($cats);
    }
}
