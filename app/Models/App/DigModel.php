<?php

namespace App\Models\App;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use App\Models\Interfaces\DigModelInterface;
use Illuminate\Support\Collection;
use App\Models\Functional\MediaModel;
use Illuminate\Database\Eloquent\Builder;
use App\Models\Tags\Tag;
use Exception;

abstract class DigModel extends Model implements HasMedia, DigModelInterface
{
    use  InteractsWithMedia;
    public $timestamps = false;
    protected $guarded = [];
    protected $eloquent_model_name;
    protected $builder;

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

    public function index($query)
    {
        $this->builderIndexLoad();
        $this->builderIndexApplyFilters($query);

        if (empty($query["order_by"])) {
            $this->builderIndexDefaultOrder();
        } else {
            $this->builderIndexOrder($query["order_by"]);
        }

        $collection = $this->builder->get();

        return  $collection->map(function ($item, $key) {
            return ["id" => $item->id, "slug" => $item->slug];
        });
    }

    public function builderIndexApplyFilters($query)
    {
        if (!empty($query["model_tag_ids"])) {
            $this->applyModelTagFilters($query["model_tag_ids"]);
        }

        if (!empty($query["global_tag_ids"])) {
            $this->applyGlobalTagFilters($query["global_tag_ids"]);
        }

        if (!empty($query["column_lookup_ids"])) {
            $this->applyColumnLookupOrValueFilters($query["column_lookup_ids"]);
        }

        if (!empty($query["column_values"])) {
            $this->applyColumnLookupOrValueFilters($query["column_values"]);
        }
        if (!empty($query["column_search"])) {
            $this->applyColumnSearchFilters($query["column_search"]);
        }
        if (!empty($query["bespoke"])) {
            $this->applyBespokeFilters($query["bespoke"]);
        }
    }

    public function applyModelTagFilters(array $tag_ids)
    {
        $modelName = "App\\Models\\Tags\\" . $this->eloquent_model_name . "Tag";
        $model = new $modelName;
        $groups = [];
        $tags = $model->select('id', 'group_id')->whereIn('id', $tag_ids)->get();

        foreach ($tags as $tag) {
            if (array_key_exists($tag->group_id, $groups)) {
                array_push($groups[$tag->group_id], $tag->id);
            } else {
                $groups[$tag->group_id] = [$tag->id];
            }
        }

        foreach ($groups as $type_id => $tag_ids_for_group) {
            $this->builder->whereHas('model_tags', function (Builder $q) use ($tag_ids_for_group) {
                $q->whereIn('id', $tag_ids_for_group);
            });
        }
    }

    public function applyGlobalTagFilters(array $tag_ids)
    {
        $tags = Tag::select('id', 'group_id')->whereIn('id', $tag_ids)->get();
        $groups = [];

        foreach ($tags as $tag) {
            if (array_key_exists($tag->group_id, $groups)) {
                array_push($groups[$tag->group_id], $tag->id);
            } else {
                $groups[$tag->group_id] = [$tag->id];
            }
        }

        foreach ($groups as $type_id => $tag_ids_for_group) {
            $this->builder->whereHas('global_tags', function (Builder $q) use ($tag_ids_for_group) {
                $q->whereIn('id', $tag_ids_for_group);
            });
        }
    }

    public function applyColumnLookupOrValueFilters(array $cols)
    {
        foreach ($cols as $key => $col) {
            $this->builder->whereIn($col["column_name"], $col["vals"]);
        }
    }


    public function applyColumnSearchFilters(array $cols)
    {
        foreach ($cols as $key => $col) {
            $this->builder->Where(function ($query) use ($key, $col) {
                foreach ($col["vals"] as $key1 => $term) {
                    $query->orWhere($col["column_name"], 'LIKE', '%' . $term . '%');
                }
            });
        }
    }
    public function applyBespokeFilters(array $bespoke)
    {
        foreach ($bespoke as $key => $item) {
            switch ($item["name"]) {
                case "Media":
                    $this->applyMediaFilter($item["vals"]);
                    break;
                default:
            }
        }
    }

    public function applyMediaFilter(array $collectionNames)
    {
        $this->builder->whereHas('media', function (Builder $mediaQuery) use ($collectionNames) {
            $mediaQuery->whereIn('collection_name', $collectionNames);
        });
    }

    public function page($ids, $view): Collection
    {
        switch ($view) {
            case 'Table':
                $this->builderPageTableLoad();
                break;

            case 'Image':
                $this->builderPageImageLoad();
                break;
        }
        $this->builder = $this->builder->whereIn('id', $ids);

        $res = $this->builder->orderBy(DB::raw('FIELD(`id`, ' . implode(',', $ids) . ')'))
            ->get();

        switch ($view) {
            case "Table":
                return $res;

            case "Image":
                $r = collect([]);
                $r = $res->map(function ($item, $key) {
                    $media = null;
                    if (!$item->media->isEmpty()) {
                        $media = ['full' => $item->media[0]->getPath(), 'tn' =>  $item->media[0]->getPath('tn')];
                    }

                    return [
                        "id" => $item["id"],
                        "slug" => $item["slug"],
                        "description" => $item["short"],
                        "media1" => $media,
                    ];
                });
                return $r;
        }
    }

    public function builderIndexOrder(array $order_by)
    {
        foreach ($order_by as $key => $data) {
            $this->builder->orderBy($data["column_name"], $data["asc"] ? 'asc' : 'desc');
        }
    }

    public function show(array $validated)
    {
        $this->builderShowLoad();
        $this->builderShowLocate($validated);
        $item = $this->builder->first();


        $discrete_columns = $this->discreteColumns($item);
        $mediaArray = [];

        if (!$item->media->isEmpty()) {
            $mediaArray = MediaModel::getMedia($item->media);
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
            "fields" => $item->makeHidden('slug'),
            "media" => $mediaArray,
            "global_tags" => $global_tags,
            "model_tags" => $model_tags,
            "discrete_columns" => $discrete_columns,
            "slug" => $item->slug,
        ];
    }

    public function carousel($id)
    {
        $this->builderShowCarouselLoad();
        $item =  $this->builder->findOrFail($id);

        $media1 = null;
        if (!$item->media->isEmpty()) {
            $media1 = MediaModel::getMedia($item->media, true);
        }

        return [
            "id" => $id,
            "slug" => $item["slug"],
            "description" => $item["short"],
            "media" => $media1,
            "module" => $this->eloquent_model_name
        ];
    }

    public function firstSlug()
    {
        $this->builderIndexLoad();
        $item = $this->builder->where('id', '<', 10)->first();
        return $item["slug"];
    }

    public function destroyItem(int $id)
    {
        $toDelete = self::findOrFail($id);
        $toDelete->delete();
    }

    public function store(array $new_item, bool $methodIsPost)
    {
        if ($methodIsPost) {
            $modelName = "App\Models\DigModels\\" . $this->eloquent_model_name;
            $item = new $modelName;
        } else {
            $item = self::findOrFail($new_item["id"]);
        }

        //copy the validated data from the validated array to the 'item' object.
        foreach ($new_item as $key => $value) {
            $item[$key] = $value;
        }

        if ($methodIsPost) {
            unset($item->id);
        }

        try {
            $item->save();
        } catch (Exception $error) {
            throw new Exception('Error while saving item to DB: ' . $error);
        }

        if ($methodIsPost) {
            return [
                "fields" => $item->makeHidden('slug'),
                "media1" => null,
                "mediaPage" => [],
                "mediaArray" => [],
                "global_tags" => [],
                "model_tags" => [],
                "discrete_columns" => $this->discreteColumns($item),
                "slug" => $item->slug,
            ];
        } else {
            return [
                "fields" => $item->makeHidden('slug'),
                "slug" => $item->slug,
            ];
        }
    }
}
