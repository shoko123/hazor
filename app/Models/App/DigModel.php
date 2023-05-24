<?php

namespace App\Models\App;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use App\Models\Interfaces\DigModelInterface;
use Illuminate\Database\Eloquent\Collection;
use App\Models\Functional\MediaModel;
use Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection;

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
        $collection = $builder->get();
        return $collection;
    }

    public function page($ids, $view): Collection
    {
        $idsAsCommaSeperatedString = implode(',', $ids);
        $desc = $this->buildSqlDescription();
        $urlId = $this->buildSqlUrlId();

        $res = $this->whereIn('id', $ids)
            ->select('id', DB::raw($desc), DB::raw($urlId))
            ->with("media")
            ->orderByRaw("FIELD(id, $idsAsCommaSeperatedString)")
            ->get();


        $res->transform(function ($item, $key) {
            $media = null;
            if (!$item->media->isEmpty()) {
                $media = ['full' => $item->media[0]->getPath(), 'tn' =>  $item->media[0]->getPath('tn')];
            }
            unset($item->media);
            $item->media1 = $media;
            return $item;
        });
        return $res;
    }

    public function show($id)
    {
        $item = $this->itemSelect()->findOrFail($id);

        $discrete_columns = $this->discreteColumns($item);
        //media: order by collection_name, order_column (done in MediaModel)
        $mediaPage = collect([]);
        $media1 = null;
        $mediaArray = [];

        if (!$item->media->isEmpty()) {
            $res = MediaModel::getMedia($item->media);
            $mediaPage = $res['mediaPage'];
            $mediaArray = $res['mediaArray'];
            $media1 = $res['media1'];
        }

        //model tags (discrete)        
        $model_tags = $item->model_tags->map(function ($tag, int $key) {
            return $tag->tag_group->name . '.' . $tag->name;
        });


        //global tags
        $global_tags = $item->global_tags->map(function ($tag, int $key) {
            return $tag->tag_group->name . '.' . $tag->name;
        });

        //unset
        unset($item->media);
        unset($item->global_tags);
        unset($item->model_tags);

        return [
            "fields" => $item,
            "media1" => $media1,
            "mediaPage" => $mediaPage,
            "mediaArray" => $mediaArray,
            "global_tags" => $global_tags,
            "model_tags" => $model_tags,
            'discrete_columns' => $discrete_columns
        ];
    }

    public function carousel($id)
    {
        $desc = $this->buildSqlDescription();
        $item = self::with('media')
            ->select('id', DB::raw($desc))
            ->findOrFail($id);

        $media1 = null;
        if (!$item->media->isEmpty()) {
            $media1 = ['full' => $item->getFirstMediaPath('photos'), 'tn' =>  $item->getFirstMediaPath('photos', 'tn')];
        }
        unset($item->media);

        return [
            "id" => $id,
            "url_id" => $this->getUrlIdFromId($id),
            "description" => $item->description,
            "media" => $media1,
        ];
    }

    public function firstUrlId()
    {
        $first = self::first();
        return $this->getUrlIdFromId($first->id);
    }

    public function destroyItem(int $id)
    {
        $toDelete = self::findOrFail($id);
        $toDelete->delete();
    }

    public function store(int $id, array $new_item, bool $methodIsPut)
    {

        if ($methodIsPut) {
            $item = self::findOrFail($id);
        } else {
            $modelName = "App\Models\DigModels\\" . $this->eloquent_model_name;
            $item = new $modelName;
        }

        //copy the validated data from the validated array to the 'item' object.
        foreach ($new_item as $key => $value) {
            $item[$key] = $value;
        }

        $item->save();

        if ($methodIsPut) {
            return [
                "fields" => $item,
                "url_id" => $this->getUrlIdFromId($item->id)
            ];
        } else {
            return [
                "fields" => $item,
                "media" => [],
                "media1" => null,
                "mediaPage" => [],
                "mediaArray" => [],
                "model_tags" => [],
                "global_tags" => [],
                "url_id" => $this->getUrlIdFromId($item->id)
            ];
        }
    }
}
