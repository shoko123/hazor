<?php

namespace App\Models\Model;

use Illuminate\Support\Facades\DB;
use App\Models\App\FindModel;
use App\Models\App\DigModel;
use App\Models\Tags\FaunaTag;
use App\Models\Tags\Tag;

class Fauna extends FindModel
{
    protected $table = 'fauna';
    public $timestamps = false;
    protected $guarded = [];

    public function __construct()
    {
        DigModel::__construct('Fauna');  
    }

    public function model_tags()
    {
        return $this->belongsToMany(FaunaTag::class, 'fauna-fauna_tags', 'item_id', 'tag_id');
    }
    
    public function global_tags()
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    public function init() : array {
        return [
            "message" => $this->eloquent_model_name . '.init()',
            "counts" => [ "items" => $this->count(), "media" => 777,],
            "trio" => $this->getTrio()
        ];
    }
 
    public function getTrio(): array
    {
        $cats = [
            "Registration" => [
                ['CV', (object)["table_name" => "loci", "column_name" => "area"]],
            ],
            "Basic Characteristics" => [
                ['TM', (object)["name" => "Life Stage", "dependency" => null, "multiple" => true]],
                ['TM', (object)["name" => "Symmetry", "dependency" => null, "multiple" => true]],
                ['TM', (object)["name" => "Weathering (Behrensmeyer 1978)", "dependency" => null, "multiple" => true]],
            ],
            "Taxon" => [
                ['LV', (object)["name" => "Base Taxon", "table_name" => "fauna_taxa", "column_name" => "taxon_id"]],
                ['TM', (object)["name" => "Bird", "dependency" => null, "multiple" => true]],
                ['TM', (object)["name" => "Mammal", "dependency" => null, "multiple" => true]],
            ],
            "Element" => [
                ['LV', (object)["name" => "Element", "table_name" => "fauna_elements", "column_name" => "element_id"]],
            ],
            "Bone" => [
                ['TM', (object)["name" => "Fusion", "dependency" => null, "multiple" => true]],
                ['TM', (object)["name" => "Breakage", "dependency" => null, "multiple" => true]],
                ['TM', (object)["name" => "D&R (Grant 1982)", "dependency" => null, "multiple" => true]],
                ['TM', (object)["name" => "Bone Name", "dependency" => null, "multiple" => true]],
            ],
            "Tooth" => [
                ['TM', (object)["name" => "Tooth Name", "dependency" => null, "multiple" => true]],
                ['TM', (object)["name" => "Tooth Age", "dependency" => null, "multiple" => true]],
                ['TM', (object)["name" => "Tooth Wear", "dependency" => null, "multiple" => true]],
            ]
        ];

        // "Fauna" => [       
        //     "Basic Characteristics" => [
        //         ["Preservation", "Lookup", "preservations", "preservation_id"],
        //         ["Life Stage", "Tag-Module", "Life-Stage"],
        //         ["Symmetry", "Tag-Module", "Symmetry"],
        //         ["Weathering (Behrensmeyer 1978)", "Tag-Module", "Weathering"],                
        //     ],
        //     "Taxon" => [
        //         ["Base Taxon", "Lookup", "fauna_taxon_L1", "taxon_L1_id"],
        //         ["Bird", "Tag-Module", "Bird"],
        //         ["Mammal", "Tag-Module", "Mammal"],
        //     ],
        //     "Element" => [
        //         ["Element", "Lookup", "fauna_elements_L1", "element_L1_id"],
        //     ], 
           
        //     "Bone" => [
        //         ["Fusion", "Tag-Module", "Fusion"],
        //         ["Breakage", "Tag-Module", "Breakage"],
        //         ["D&R (Grant 1982)", "Tag-Module", "D&R"],
        //         ["Bone Name", "Tag-Module", "Bone-Name"],
        //     ],
        //     "Tooth" => [
        //         ["Tooth Name", "Tag-Module", "Tooth-Name"],
        //         ["Tooth Age", "Tag-Module", "Tooth-Age"],
        //         ["Tooth Wear", "Tag-Module", "Tooth-Wear"],
        //     ]
        // ],        
        return $this->buildTrio($cats);
    }
    
    function buildSqlDescription() : string {
        return 'CONCAT(label, ", ", taxon, ", ", element) AS description';
    }
    function buildSqlUrlId() : string {
        return 'basket AS url_id';
    }
}
