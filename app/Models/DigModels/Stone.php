<?php

namespace App\Models\DigModels;

use Illuminate\Support\Facades\DB;

use App\Models\App\DigModel;
use App\Models\App\FindModel;
use App\Models\Tags\StoneTag;
use App\Models\Tags\Tag;
use App\Http\Requests\DigModelStoreRequest;
use App\Models\Lookups\StoneBaseType;
use App\Models\Lookups\StoneMaterial;
use Illuminate\Database\Eloquent\Model;
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

    public function baseType()
    {
        return $this->belongsTo(StoneBaseType::class, 'base_type_id');
    }

    public function material()
    {
        return $this->belongsTo(StoneMaterial::class, 'material_id');
    }

    public function init(): array
    {
        return [
            "message" => $this->eloquent_model_name . '.init()',
            "counts" => ["items" => $this->count(), "media" => DB::table('media')->where('model_type', 'Stone')->count(),],
            "itemViews" => config('display_options.itemViews.Stone'),
        ];
    }

    public function builderOrder(): void
    {
        $this->builder->orderBy('id', 'asc');
    }

    //show - single model
    function rawSqlSlug(): string
    {
        return 'CONCAT(basket , ".", stone_no) AS slug';
    }

    public function builderItemSelect(): void
    {
        $this->builder = self::with([
            'media',
            'model_tags.tag_group',
            'global_tags.tag_group'/* => function ($query) {
                $query->select('id', 'name', 'type');
            },*/,
            'material',
            'baseType'
        ]);
    }

    public function builderItemLocate(array $v): void
    {
        $this->builder->where('basket', '=', $v["params"]["basket"])->where('stone_no', '=', $v["params"]["stone_no"]);   
    }

    public function itemToIdParams(Model $item): array
    {
        return [
            "id" => $item["id"],
            "slug" => $item["basket"] . '.' . $item["stone_no"],
            "tag"  => 'B' . $item["basket"] . '/' . $item["stone_no"],
        ];
    }

    public function discreteColumns(Model $fields): array
    {
        $material = 'Material' . '.' . $fields["material"]["name"];
        $base_type = 'Basic Typology' . '.' . $fields["baseType"]["name"];
        unset($fields->material);
        unset($fields->baseType);
        return [$material, $base_type];
    }

    public function itemShortDescription(Model $item): string
    {
        return $item["description"];
    }

}
