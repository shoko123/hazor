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
    ];

    /*
(1,'Mammal',0,'[[\"L>taxon_L1_id>4\"]]'),
(2,'Bird',0,'[[\"L>taxon_L1_id>5\"]]'),
-- element
(10,'Life-Stage',1,NULL),
(11,'Symmetry',0,NULL),
(12,'Fusion',0,'[[\"L>element_L1_id>3\"]]'),
(13,'Breakage',1,'[[\"L>element_L1_id>3\"]]'),
(14,'D&R',1,'[[\"L>element_L1_id>3\"]]'),
(15,'Weathering',0,'[[\"L>element_L1_id>3\"]]'),
(20,'Bone-Name',0,'[[\"L>element_L1_id>3\"]]'),
(70,'Tooth-Name',0,'[[\"L>element_L1_id>4\"]]'),
(71,'Tooth-Age',0,'[[\"L>element_L1_id>4\"]]'),
(72,'Tooth-Wear',1,'[[\"L>element_L1_id>4\"]]');
    */
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
