<?php

namespace App\Models\DigModels;

use Illuminate\Support\Facades\DB;
use App\Models\App\FindModel;
use App\Models\App\DigModel;
use App\Models\Tags\FaunaTag;
use App\Models\Tags\Tag;
use App\Models\Lookups\FaunaElement;
use App\Models\Lookups\FaunaTaxon;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

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

    public function base_taxon()
    {
        return $this->belongsTo(FaunaTaxon::class, 'taxon_id');
    }

    public function element_tag()
    {
        return $this->belongsTo(FaunaElement::class, 'element_id');
    }

    public function init() : array {
        return [
            "message" => $this->eloquent_model_name . '.init()',
            "counts" => [ "items" => $this->count(), "media" => 777,],
            "itemViews" => config('display_options.itemViews.Fauna'),
        ];
    }
    
    function buildSqlDescription() : string {
        return 'CONCAT(label, ", ", taxon, ", ", element) AS description'; 
    }
    function buildSqlUrlId() : string {
        return 'id AS url_id';
    }
    
    function getIdFromUrlId(string $url_id) : int {
        return $url_id;
    }

    function getUrlIdFromId(int $id) : string {
        return $id;
    }
    
    public function indexSelect(): Builder {
        $url_id = $this->buildSqlUrlId();
        return $this->select('id', DB::raw($url_id));
    }
    public function pageSelect(): string {
        return 'xxx';
    }

    public function itemSelect(): Builder {
        return self::with([
            'media',
            'model_tags.tag_group',
            'global_tags.tag_group',
            'base_taxon',
            'element_tag',
        ]);
    }
     
    public function discreteColumns(Model $fields): array {
        $c1 = 'Element' . '.' . $fields->element_tag->name;
        $c2 = 'Base Taxon' . '.' . $fields->base_taxon->name;
        unset($fields->element_tag);
        unset($fields->base_taxon);
        return [$c1, $c2];
    }    
    
    public function indexFormat(): string  {
        return 'xxx';
    }
    public function pageFormat(): string  {
        return 'xxx';
    }
    public function itemFormat(): string {
        return 'xxx';
    }
}
