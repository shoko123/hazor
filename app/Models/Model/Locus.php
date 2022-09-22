<?php

namespace App\Models\Model;

use Illuminate\Support\Facades\DB;
use App\Models\App\DigModel;
use App\Models\Tags\LocusTag;
use App\Models\Tags\Tag;

class Locus extends DigModel
{
    public $timestamps = false;
    protected $guarded = [];
    protected $table = 'loci';

    public function __construct()
    {
        DigModel::__construct('Locus');
    }

    public function model_tags()
    {
        return $this->belongsToMany(LocusTag::class, 'locus-locus_tags', 'item_id', 'tag_id');
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

    function getTrio(): array
    {
        $cats = [
            "Registration" => [
                ['CV', (object)[ "table_name" => "loci", "column_name" => "area"]], 
                ['TS', null]],
            "Chronology" => [
                ['TM', (object)["name" => "Stratum", "dependency" => null]],
            ],
        ];

        return $this->buildTrio($cats);
    }

    function buildSqlDescription(): string
    {
        return 'type AS description';
    }

    function buildSqlUrlId(): string
    {
        return 'name AS url_id';
    }
}
