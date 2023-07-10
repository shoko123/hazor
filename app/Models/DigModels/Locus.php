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

    function buildSqlUrlId(): string
    {
        return 'id AS url_id';
    }

    function getIdFromUrlId(string $url_id): int
    {
        return $url_id;
    }

    function getUrlIdFromId(int $id): string
    {
        return $id;
        $item = $this->findOrFail($id);
        $url_id = is_null($item->year) ? "0000-" : $item->year . "-";
        $url_id .= $item->locus_no;
        $url_id .= $item->area . "-";
        $url_id .=  is_null($item->addendum) ? $item->addendum : "";
        return $url_id;
    }

    public function builderIndexSelect(): void
    {
        $url_id = $this->buildSqlUrlId();
        $this->builder = $this->select('id', DB::raw($url_id));
    }

    public function builderOrder(): void
    {
        $this->builder->orderBy('id', 'asc');
    }

    public function itemSelect(): Builder
    {
        return self::with([
            'media',
            'model_tags.tag_group',
            'global_tags.tag_group'/* => function ($query) {
                $query->select('id', 'name', 'type');
            },*/
        ]);
    }

    public function itemGet(object $slug_params): Builder
    {
        return self::findWhere('id',  $slug_params["id"]);
    }

    public function itemToIdParams(Model $item): array
    {
        return [
            "id" => $item["id"],
            "slug" => $item["area"] . '.' . $item["name"],
            "tag"  => $item["area"] . '/' . $item["name"],
        ];
    }

    public function discreteColumns(Model $model): array
    {
        $area = 'Area' . '.' . $model["area"];
        return [$area];
    }

    public function itemShortDescription(Model $item): string
    {
        return $item["type"];
    }
    public function pageFormat(): string
    {
        return 'xxx';
    }
    public function itemFormat(): string
    {
        return 'xxx';
    }
}
