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
            ->orderByRaw(DB::raw("FIELD(id, $idsAsCommaSeperatedString)"))
            ->get();

        if ($view  === "Media") {
            $items->transform(function ($item, $key) {
                $item["primaryMedia"] = null;
                return $item;
            });
        }
        return $items;
    }

    public function show($id)
    {
        $item = self::findOrFail($id);
        return $item;
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
