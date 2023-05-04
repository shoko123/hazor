<?php

namespace App\Models\DigModels;

use Illuminate\Support\Facades\DB;

use App\Models\App\DigModel;
use App\Models\App\FindModel;
use App\Models\Tags\StoneTag;
use App\Models\Tags\Tag;

use Illuminate\Database\Eloquent\Builder;

class Stone extends FindModel
{
    public $timestamps = false;
    protected $guarded = [];
    protected $table = 'stones';

    public function __construct()
    {
        DigModel::__construct('Stone');
    }

    public function model_tags()
    {
        return $this->belongsToMany(StoneTag::class, 'stone-stone_tags', 'item_id', 'tag_id');
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
            "itemViews" => config('display_options.itemViews.Stone'),
        ];
    }

    function buildSqlDescription(): string
    {
        return 'details AS description';
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
    }

    public function indexSelect(): Builder
    {
        $url_id = $this->buildSqlUrlId();
        return $this->select('id', DB::raw($url_id));
    }

    public function store($id, $new_item, $methodIsPut)
    {
        //$validator = new StoneStoreRequest;

        //return $r["item"];        

        //return ["req item" => $r["item"], "req id" => $id];      
        //$validated = $r->validated();

        if ($methodIsPut) {
            //authorize & validate
            //$this->authorize('update', $this->model);

            //load current stone
            $item = Stone::findOrFail($id);
            $old = clone $item;
        } else {
            //$this->authorize('create', $this->model);
            $item = new Stone;
        }
        //copy the validated data from the validated array to the 'item' and 'find' objects.
        //$item["details"] = "XXXXX";//$r["item.details"];
        foreach ($new_item as $key => $value) {
            $item[$key] = $value;
        }


        $item->save();
        return ["old" => $old, "new" => $item, "req.item" => $new_item];
    }

    public function pageSelect(): string
    {
        return 'xxx';
    }

    public function itemSelect(): string
    {
        return 'xxx';
    }
    public function indexFormat(): string
    {
        return 'xxx';
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
