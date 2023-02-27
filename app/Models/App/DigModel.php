<?php

namespace App\Models\App;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use App\Models\Interfaces\DigModelInterface;
use Illuminate\Database\Eloquent\Collection;

abstract class DigModel extends Model implements HasMedia, DigModelInterface
{
    use  InteractsWithMedia;
    public $timestamps = false;
    protected $guarded = [];
    protected $eloquent_model_name;

    abstract function buildSqlDescription(): string;
    abstract function buildSqlUrlId(): string;
    abstract function init(): array;
    abstract function getIdFromUrlId(string $url_id): int;
    abstract function getUrlIdFromId(int $id): string;

    public function __construct($eloquent_model_name = null)
    {
        $this->eloquent_model_name = $eloquent_model_name;
    }

    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('tn')
            ->width(250)
            ->height(250)
            ->sharpen(10)
            ->nonQueued();
    }

    public function index($queryParams)
    {
        $builder = $this->indexSelect();
        $collection = $builder->take(5000)->get();
        return $collection;
    }

    public function page($ids, $view): Collection
    {
        $idsAsCommaSeperatedString = implode(',', $ids);
        $desc = $this->buildSqlDescription();
        $urlId = $this->buildSqlUrlId();

        $items = $this->whereIn('id', $ids)
            ->select('id', DB::raw($desc), DB::raw($urlId))
            ->orderByRaw("FIELD(id, $idsAsCommaSeperatedString)")
            ->get();

        if ($view  === "Media") {
            $items->transform(function ($item, $key) {
                $item["media"] = null;
                return $item;
            });
        }
        return $items;
    }

    public function show($id)
    {
        $item = self::with([
            'media',
            'model_tags',
            'global_tags'/* => function ($query) {
                $query->select('id', 'name', 'type');
            },*/
        ])->findOrFail($id);

        $media = [];
        $media1 = null;
        if (!$item->media->isEmpty()) {
            foreach ($item->media as $med) {
                array_push($media, ['fullPath' => $med->getPath(), 'tnPath' =>  $med->getPath('tn')]);
            }
            $media1 = $media[0];
        }
        unset($item->media);
        unset($item->global_tags);
        unset($item->model_tags);

        return ["fields" => $item, "media" => $media, "media1" => $media1];

        $builder = $this->with(
            [
                'find',
                'find.locus' => function ($query) {
                    $query->select('id', 'locus_no', 'area_season_id');
                },
                'find.locus.areaSeason' => function ($query) {
                    $query->select('id', 'dot');
                },

                'module_tags',
                'tags' => function ($query) {
                    $query->select('id', 'name', 'type');
                },
                'media',
            ]
        );



        //format tag
        $find = $item->find;
        $item->dot = $find->locus->areaSeason->dot . "." . $find->locus->locus_no . "." . $find->registration_category . "." . $find->basket_no . "." . $find->artifact_no;
        $dotWithoutArtifactNo = $find->locus->areaSeason->dot . "." . $find->locus->locus_no . "." . $find->registration_category . "." . $find->basket_no . ".";

        //add fields
        $item->locus_id = $find->locus->id;
        $item->area_season_id = $find->locus->areaSeason->id;
        $item->locus_id = $find->locus->id;

        $find->locus_id = $find->locus->id;
        $find->area_season_id = $find->locus->areaSeason->id;

        //format tags
        $tags = [];
        $moduleTags = [];

        foreach ($item->module_tags as $tag) {
            array_push($moduleTags, (object) [
                'type_id' => $tag->type_id,
                'type' => $tag->tag_type->name,
                'id' => $tag->pivot->tag_id,
                'name' => $tag->name
            ]);
        }
        foreach ($item->tags as $tag) {
            array_push($tags, (object) [
                'type' => $tag->type,
                'id' => $tag->pivot->tag_id,
            ]);
        }

        //format media.
        $itemMedia = $this->allMedia($item);
        $item["hasMedia"] = $itemMedia->primary->hasMedia;
        $item["tnUrl"] = $itemMedia->primary->tnUrl;
        $item["fullUrl"] = $itemMedia->primary->fullUrl;


        //if Pottery or Fauna add related artifacts
        $related = [];

        // $l = new Locus();
        // $related = $l->locusAllFinds($find->locus_id);

        // if ($p["module"] === "Pottery" || $p["module"] === "Fauna") {
        //     $res = Find::where('findable_type', $p["module"])
        //         ->where('locus_id', $p["locus_id"])
        //         ->where('basket_no', $p["basket_no"])
        //         ->where('artifact_no', '<>', $p["artifact_no"])
        //         ->orderBy('artifact_no')
        //         ->get()->pluck('artifact_no');
        //     $related = collect($res)->map(function ($item) use ($dotWithoutArtifactNo) {
        //         return $dotWithoutArtifactNo . $item;
        //     });
        // }


        unset($itemMedia->primary);
        unset($item->find);
        unset($item->media);
        unset($item->tags);
        unset($item->moduleTags);
        unset($find->locus);

        return [
            "item" => $item,
            "find" => $find,
            "itemMedia" => $itemMedia,
            "tags" => $tags,
            "moduleTags" => $moduleTags,
            "related" => $related,
            //"locusFinds" => $locusFinds
        ];
    }

    public function showCarouselItem($id)
    {
        $desc = $this->buildSqlDescription();
        $builder = $this->with(
            'media',
        )->selectRaw($desc);

        $item = $builder->findOrFail($id);
        $media1 = $item->media;
        unset($item->media);

        return [
            "id" => $id,
            "url_id" => $this->getUrlIdFromId($id),
            "description" => $item->description,
            "media" => null,
        ];
    }

    public function firstUrlId()
    {
        $first = self::first();
        return $this->getUrlIdFromId($first->id);
    }
}
