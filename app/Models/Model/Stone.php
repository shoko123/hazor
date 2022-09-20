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
                ['TS', null],
                ['VC', (object)["table_name" => "loci", "column_name" => "area"]],
            ],
            "Periods" => [
                ['TG', (object)["name" => "Periods (Top-Level)", "dependency" => null]],
                ['TG', (object)["name" => "Neolithic Subperiods", "dependency" => null]],
                ['TG', (object)["name" => "Bronze Subperiods", "dependency" => null]],
            ],
            "Basic Charectaristics" => [
                ['TM', (object)["name" => "Life-Stage", "dependency" => null]],
                ['TM', (object)["name" => "Morphology", "dependency" => null]],
                ['TM', (object)["name" => "Production", "dependency" => null]],
                ['TM', (object)["name" => "Profile", "dependency" => null]],
                ['LV', (object)["name" => "Material", "table_name" => "stone_materials", "column_name" => "material_id"]],
            ],
        ];

        return $this->buildTrio($cats);
    }

    /*
    (1,'Life-Stage',1,NULL),
    (2,'Morphology',1,NULL),
    (3,'Production',1,NULL),
    (4,'Profile',1,NULL),
    (5,'Type-Active',1,'[[\"L>base_type_id>3\"]]'),
    (6,'Type-Non-Processor',1,'[[\"L>base_type_id>6\"]]'),
    (7,'Type-Passive',1,'[[\"L>base_type_id>2\"]]'),
    (8,'Use-Wear',1,NULL),
    (9,'Vessel-Base',1,'[[\"M>101\"]]'),
    (10,'Vessel-Part',1,'[[\"L>base_type_id>5\"]]'),
    (11,'Vessel-Rim',1,'[[\"M>103\"]]'),
    (12,'Vessel-Wall',1,'[[\"M>102\"]]');
    */

    function buildSqlDescription(): string
    {
        return 'details AS description';
    }
    function buildSqlUrlId(): string
    {
        return 'basket AS url_id';
    }
}
