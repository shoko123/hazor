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

    public function initInfo(): array
    {
        return [
            "display_options" => [
                "item_views" =>  ['Main', 'Media', 'Related'],
                "main_collection_views" => ["Image", "Table", "Chip"],
                "related_collection_views" => ["Image", "Table", "Chip"],
            ],
            "welcome_text" => 'Sources:
            Hazor VII: The 1990-2012 Excavations, The Bronze Age. 2017. A. Ben-Tor, S. Zuckerman, S. Bechar, and D. Sandhaus, eds. Jerusalem. 
            Hazor VI: The 1990-2009 Excavations, The Iron Age. 2012. A. Ben-Tor, D. Ben-Ami, and D. Sandhaus, eds. Jerusalem.'
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

    public function builderView0Load(): void
    {
        $this->builder = self::with([
            'media' => function ($query) {
                $query->orderBy('order_column');
            },
            'model_tags.tag_group',
            'global_tags.tag_group',
        ]);
    }

    public function builderView0PostLoad(object $item): array
    {
        return $this->relatedFinds($item);        
    }

    protected function relatedFinds(object $item): array
    {
        $related = [];
        $stones = Stone::with([
            'media' => function ($query) {
                $query->orderBy('order_column');
            }
        ])->where('locus', '=', $item["name"])->where('area', '=', $item["area"])
            ->orderBy('basket')->orderBy('stone_no')
            ->get();

        foreach ($stones as $item) {
            array_push($related, [
                "relation_name" => "Finds in Locus",
                "module" => "Stone",
                "id" => $item["id"],
                "slug" => $item["slug"],
                "short" => $item["short"],
                "media" => count($item->media) === 0 ? null : MediaModel::getUrlsOfOne($item->media),
            ]);
        }

        $fauna = Fauna::with([
            'media' => function ($query) {
                $query->orderBy('order_column');
            }
        ])->where('locus', '=', $item["name"])->where('area', '=', $item["area"])
            ->orderBy('label')
            ->get();

        foreach ($fauna as $item) {
            array_push($related, [
                "relation_name" => "Finds in Locus",
                "module" => "Fauna",
                "id" => $item["id"],
                "slug" => $item["slug"],
                "short" => $item["short"],
                "media" => count($item->media) === 0 ? null : MediaModel::getUrlsOfOne($item->media),
            ]);
        }
        return $related;
    }

    public function meAndRelated(int $id)
    {
        $locus = $this->builder = self::with([
            'media' => function ($query) {
                $query->orderBy('order_column');
            }
        ])->findOrFail($id);

        $related_locus = [
            "relation_name" => "Locus",
            "module" => "Locus",
            "id" => $id,
            "slug" => $locus["slug"],
            "short" => $locus["short"],
            "media" => count($locus->media) === 0 ? null : MediaModel::getUrlsOfOne($locus->media),
            "module" => "Locus"
        ];

        $related_finds = $this->relatedFinds(($locus));     
        array_unshift($related_finds, $related_locus);   
        return $related_finds;
    }

    public function builderShowCarouselLoad(): void
    {
        $this->builder = $this->select('id', 'area', 'name', 'type', 'cross_ref')->with("media");
    }
}
