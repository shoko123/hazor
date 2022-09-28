<?php

namespace App\Models\Model;

use Illuminate\Support\Facades\DB;

use App\Models\App\DigModel;
use App\Models\App\FindModel;
use App\Models\Tags\StoneTag;
use App\Models\Tags\Tag;

class Stone extends FindModel
{
    public $timestamps = false;
    protected $guarded = [];
    protected $table = 'stones';

    public function __construct()
    {
        DigModel::__construct('Stone');
    }

    public function module_tags()
    {
        return $this->belongsToMany(StoneTag::class, 'stone-stone_tags', 'item_id', 'tag_id');
    }

    public function global_tags()
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    public function init(): array
    {
        return [
            "message" => $this->eloquent_model_name . '.init()',
            "counts" => ["items" => $this->count(), "media" => 777,],
            "trio" => $this->getTrio()
        ];
    }

    public function getTrio(): array
    {
        $cats = [
            "Registration" => [
                ['CV', (object)["table_name" => "loci", "column_name" => "area"]],
            ],
            "Periods" => [
                ['TG', (object)["name" => "Periods (Top-Level)", "dependency" => null, "multiple" => true]],
                ['TG', (object)["name" => "Neolithic Subperiods", "dependency" => [["TG.10300"]], "multiple" => true]],
                ['TG', (object)["name" => "Bronze Subperiods", "dependency" => [["TG.10500"]], "multiple" => true]],
            ],
            "Basic Charectaristics" => [
                ['LV', (object)["name" => "Material", "table_name" => "stone_materials", "column_name" => "material_id"]],
                ['TM', (object)["name" => "Life Stage", "dependency" => null, "multiple" => true]],
                ['TM', (object)["name" => "Morphology", "dependency" => null, "multiple" => true]],
                ['TM', (object)["name" => "Profile", "dependency" => null, "multiple" => true]],
                ['TM', (object)["name" => "Production", "dependency" => null, "multiple" => true]],
                ['TM', (object)["name" => "Use Wear", "dependency" => null, "multiple" => true]],
                ['TM', (object)["name" => "Profile", "dependency" => null, "multiple" => true]],
                ['LV', (object)["name" => "Basic Typology", "table_name" => "stone_base_types", "column_name" => "base_type_id"]],

            ],
            "Typology" => [
                ['TM', (object)["name" => "Passive Subtype", "dependency" => [["LV.base_type_id.2"]], "multiple" => true]],
                ['TM', (object)["name" => "Active Subtype", "dependency" => [["LV.base_type_id.3"]], "multiple" => true]],
                ['TM', (object)["name" => "Vessel Part", "dependency" => [["LV.base_type_id.5"]], "multiple" => true]],
                ['TM', (object)["name" => "Vessel Base", "dependency" => [["TM.101"]], "multiple" => true]],
                ['TM', (object)["name" => "Vessel Wall", "dependency" => [["TM.102"]], "multiple" => true]],
                ['TM', (object)["name" => "Vessel Rim", "dependency" => [["TM.103"]], "multiple" => true]],
                ['TM', (object)["name" => "Non-Processor Subtype", "dependency" => [["LV.base_type_id.6"]], "multiple" => true]],
            ]

        ];

        return $this->buildTrio($cats);
    }

    function buildSqlDescription(): string
    {
        return 'details AS description';
    }
    function buildSqlUrlId(): string
    {
        return 'basket AS url_id';
    }
}
