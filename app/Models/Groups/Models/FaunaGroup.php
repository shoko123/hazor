<?php

namespace App\Models\Groups\Models;

use App\Models\Interfaces\ModelGroupInterface;
use App\Models\Groups\ModelGroup;

require_once app_path() . '/Models/Groups/global_tag_groups.php';

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
        "Registration Clean" => [
            "group_type_code" => "CB",
            "column_name" => "registration_clean",
            "params" => [["name" => "True"], ["name" => "False"]]//true label, false label
        ],
        "Scope" => [
            "group_type_code" => "CL",
            "dependency" => null,
            "table_name" => "fauna_scopes",
            "column_name" => "scope_id",
        ],
        "Base Taxon" => [
            "group_type_code" => "CL",
            "dependency" => null,
            "table_name" => "fauna_base_taxa",
            "column_name" => "base_taxon_id",
        ],
        "Mammal" => [
            "group_type_code" => "TM",
            "dependency" => ["Base Taxon.Mammal"],
            "multiple" => true
        ],
        "Anatomical Cluster" => [
            "group_type_code" => "TM",
            "dependency" => ["Scope.Multiple Elements"],
            "multiple" => true
        ],
        "Bird" => [
            "group_type_code" => "TM",
            "dependency" => ["Base Taxon.Bird"],
            "multiple" => true
        ],
        "Material" => [
            "group_type_code" => "CL",
            "dependency" => ["Scope.Single Element"],
            "table_name" => "fauna_materials",
            "column_name" => "material_id"
        ],
        "Symmetry" => [
            "group_type_code" => "CL",
            "dependency" => ["Scope.Single Element"],
            "table_name" => "fauna_symmetries",
            "column_name" => "symmetry_id"
        ],
        "Modifications" => [
            "group_type_code" => "TM",
            "dependency" =>  ["Scope.Single Element"],
            "multiple" => true
        ],
        "Bone Name" => [
            "group_type_code" => "TM",
            "dependency" => ["Material.Bone"],
            "multiple" => true
        ],
        "Fusion Proximal" => [
            "group_type_code" => "CL",
            "dependency" => ["Material.Bone"],
            "table_name" => "fauna_fusions",
            "column_name" => "fusion_proximal_id"
        ],
        "Fusion Distal" => [
            "group_type_code" => "CL",
            "dependency" => ["Material.Bone"],
            "table_name" => "fauna_fusions",
            "column_name" => "fusion_distal_id"
        ],

        "Tooth Name" => [
            "group_type_code" => "TM",
            "dependency" => ["Material.Tooth"],
            "multiple" => true
        ],
        "Tooth Age" => [
            "group_type_code" => "TM",
            "dependency" => ["Material.Tooth"],
            "multiple" => true
        ],
        "Tooth Wear" => [
            "group_type_code" => "TM",
            "dependency" => ["Material.Tooth"],
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
            "Registration" => [
                "Registration Clean",                
                "Scope",
                "Material",
                "Modifications",
                "Symmetry",
            ],
            "Multiple Elements" => [
                "Anatomical Cluster",
            ],
            "Bone" =>  [
                "Bone Name",
                "Fusion Proximal",
                "Fusion Distal",
            ],
            "Taxon" => [
                "Base Taxon",
                "Mammal",
                "Bird",
            ],
            "Order By" => [
                "Order By",
            ]
        ];

        return $this->buildTrio($cats);
    }
}
