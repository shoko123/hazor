<?php

namespace App\Models\DigModels;

use Illuminate\Support\Facades\DB;
use App\Models\App\DigModel;
use App\Models\Tags\LocusTag;
use App\Models\Tags\Tag;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

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
            "counts" => ["items" => $this->count(), "media" => DB::table('media')->where('model_type', 'Locus')->count(),],
            "itemViews" => config('display_options.itemViews.Locus'),
        ];
    }

 public function builderPageTableSelect(string $sqlSlug): void
    {
        $this->builder = $this->select('id', DB::raw($sqlSlug), 'area', 'name',  'year', 'square', 'stratum', 'type', 'cross_ref', 'description', 'notes', 'elevation');
    }

    function rawSqlSlug(): string
    {
        return 'CONCAT(area , ".", name) AS slug';
    }

    public function builderOrder(): void
    {
        $this->builder->orderBy('id', 'asc');
    }

   

    public function builderItemSelect(): void
    {
        $this->builder = self::with([
            'media',
            'model_tags.tag_group',
            'global_tags.tag_group',
        ]);
    }

    public function builderItemLocate(array $v): void
    {
        $this->builder->where('area', '=', $v["params"]["area"])->where('name', '=', $v["params"]["name"]);
    }

    public function slugFromItem(Model $item): string
    {
        return $item["area"] . '.' . $item["name"];
    }

    public function discreteColumns(Model $model): array
    {
        $area = 'Area' . '.' . $model["area"];
        return [$area];
    }

    public function itemShortDescription(Model $item): string
    {
        return is_null($item["type"]) ? "" : $item["type"];
    }
}
