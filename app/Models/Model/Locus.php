<?php

namespace App\Models\Model;

use Illuminate\Support\Facades\DB;
use App\Models\App\DigModel;
use App\Models\Tags\LocusTag;
use App\Models\Tags\Tag;
use Illuminate\Database\Eloquent\Builder;

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
            "itemViews" => config('display_options.itemViews.Locus'),
        ];
    }

    function buildSqlDescription(): string
    {
        return 'type AS description';
    }

    function buildSqlUrlId(): string
    {
        return 'name AS url_id';
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

    public function itemSelect(): string {
        return 'xxx';
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
