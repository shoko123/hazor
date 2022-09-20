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

    public function module_tags()
    {
        return $this->belongsToMany(FaunaTag::class, 'locus-locus_tags', 'item_id', 'tag_id');
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
 
    function getTrio(): array {
        return [];
    }
    
    function buildSqlDescription() : string {
        return 'CONCAT(label, ", ", taxon, ", ", element) AS description';
    }
    function buildSqlUrlId() : string {
        return 'basket AS url_id';
    }
}
