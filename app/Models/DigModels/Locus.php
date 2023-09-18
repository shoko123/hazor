<?php

namespace App\Models\DigModels;

use Illuminate\Support\Facades\DB;
use App\Models\App\DigModel;
use App\Models\DigModels\Stone;
use App\Models\DigModels\Fauna;
use App\Models\Tags\LocusTag;
use App\Models\Tags\Tag;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use App\Models\Functional\MediaModel;
use Illuminate\Database\Query\JoinClause;

class Locus extends DigModel
{
    public $timestamps = false;
    protected $guarded = [];
    protected $table = 'loci';
    protected $appends = ['slug', 'short'];

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

    public function getSlugAttribute()
    {
        return $this->area . '.' . $this->name;
    }

    public function getShortAttribute()
    {
        $short = is_null($this->type) ? "" : 'Type: ' . $this->type . '. ';
        $short .= empty($this->cross_ref) ? "" : 'Ref: ' . $this->cross_ref;
        return $short;
    }

    public function builderIndexLoad(): void
    {
        $this->builder = $this->select('id', 'area', 'name');
    }

    public function builderIndexDefaultOrder(): void
    {
        $this->builder->orderBy('id', 'asc');
    }

    public function builderPageTableLoad(): void
    {
        $this->builder = $this->select('*');
    }

    public function builderPageImageLoad(): void
    {
        $this->builder = $this->select('id', 'area', 'name', 'type', 'cross_ref')
            ->with(['media' => function ($query) {
                $query->select('*')->orderBy('order_column');
            }]);
    }

    public function builderShowLocate(array $v): void
    {
        $this->builder->where('area', '=', $v["params"]["area"])->where('name', '=', $v["params"]["name"]);
    }

    public function builderShowLoad(): void
    {
        $this->builder = self::with([
            'media' => function ($query) {
                $query->select('*')->orderBy('order_column');
            },
            'model_tags.tag_group',
            'global_tags.tag_group',
        ]);
    }

    public function meAndRelated(int $id)
    {
        $related = [];
        $locus = $this->builder = self::with([
            'media' => function ($query) {
                $query->orderBy('order_column');
            }
        ])->findOrFail($id);

        $ret_locus = [
            "id" => $id,
            "slug" => $locus["slug"],
            "short" => $locus["short"],
            "media" => count($locus->media) === 0 ? null : MediaModel::getUrlsOfOne($locus->media),
            "module" => "Locus"
        ];

        array_push($related, [
            "relation_name" => "Locus",
            "module" => "Locus",
            "id" => $id,
            "slug" => $locus["slug"],
            "short" => $locus["short"],
            "media" => count($locus->media) === 0 ? null : MediaModel::getUrlsOfOne($locus->media),
            "module" => "Locus"
        ]);
        // return [
        //     ["name" => "meAndRelated", "isArray" => true, "value" => $ret_locus],
        // ];


        $stones = Stone::with([
            'media' => function ($query) {
                $query->orderBy('order_column');
            }
        ])->where('locus', '=', $locus["name"])->where('area', '=', $locus["area"])
        ->orderBy('basket')->orderBy('stone_no')
            ->get();

        $ret_stones = [];
        foreach ($stones as $st) {
            array_push($related, [
                "relation_name" => "Finds in Locus",
                "module" => "Stone",
                "id" => $st["id"],
                "slug" => $st["slug"],
                "short" => $st["short"],
                "media" => count($st->media) === 0 ? null : MediaModel::getUrlsOfOne($st->media),
            ]);
        }

            return $related;

        return [
            ["name" => "locus", "isArray" => false, "value" => $ret_locus],
            ["name" => "locus_finds", "isArray" => true, "value" => $ret_stones],
        ];
    }

    public function builderShowCarouselLoad(): void
    {
        $this->builder = $this->select('id', 'area', 'name', 'type', 'cross_ref')->with("media");
    }

    public function discreteColumns(Model $model): array
    {
        $area = 'Area' . '.' . $model["area"];
        return [$area];
    }
}
