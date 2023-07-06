<?php

namespace App\Models\ModelGroup;

use App\Models\Interfaces\ModelGroupInterface;
use App\Models\ModelGroup\ModelGroup;

require_once 'global_tag_groups.php';

class LocusGroup extends ModelGroup implements ModelGroupInterface
{
    static private $model_groups = [
        "Area" => [
            "group_type_code" => "CR",
            "table_name" => "loci",
            "column_name" => "area",
        ],
        "Stratum" => [
            "group_type_code" => "TM",
            "dependency" => null,
            "multiple" => true
        ],
        "Search-Name" => [
            "group_type_code" => "CS",
            "column_name" => "name",
        ],
        "Search-Description" => [
            "group_type_code" => "CS",
            "column_name" => "description",
        ],
        "Search-Type" => [
            "group_type_code" => "CS",
            "column_name" => "type",
        ],
        "Search-Square" => [
            "group_type_code" => "CS",
            "column_name" => "square",
        ],
        "Search-Stratum" => [
            "group_type_code" => "CS",
            "column_name" => "stratum",
        ],        
    ];

    public function __construct()
    {
        ModelGroup::__construct('Locus');
        self::$groups = array_merge(globalGroups(), self::$model_groups);
    }

    public static function getModelGroups(): array
    {
        return self::$groups;
    }

    public static function getModelGroupNames(): array
    {
        return array_keys(self::$groups);
    }

    public function trio(): array
    {
        $cats = [
            "Registration" => [
                ["Area", "Stratum"]
            ], 
            "Search" => [
                [
                    "Search-Name",
                    "Search-Description",
                    "Search-Square",
                    "Search-Stratum",
                    "Search-Type",
                ]
            ],
        ];

        return $this->buildTrio($cats);
    }
}
