<?php

namespace App\Models\DigModels;

use Illuminate\Support\Facades\DB;

use App\Models\App\DigModel;
use App\Models\App\FindModel;
use App\Models\Tags\StoneTag;
use App\Models\Tags\Tag;
use App\Models\Lookups\StoneBaseType;
use App\Models\Lookups\StoneMaterial;
use App\Models\DigModels\Locus;
use App\Models\Functional\MediaModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\JoinClause;

class Stone extends FindModel
{
    public $timestamps = false;
    protected $guarded = [];
    protected $table = 'stones';
    protected $appends = ['slug', 'short'];

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

    public function getSlugAttribute()
    {
        return $this->basket . '.' . $this->stone_no;
    }

    public function getShortAttribute()
    {
        return is_null($this->type) ? "TBD" : $this->type;
    }

    public function init(): array
    {
        return [
            "message" => $this->eloquent_model_name . '.init()',
            "counts" => ["items" => $this->count(), "media" => DB::table('media')->where('model_type', 'Stone')->count(),],
            "item_views" => config('app_specific.display_options.item_views.Stone'),
        ];
    }

    public function builderIndexLoad(): void
    {
        $this->builder = $this->select('id', 'basket', 'stone_no');
    }

    public function builderIndexDefaultOrder(): void
    {
        $this->builder->orderBy('basket', 'asc')->orderBy('stone_no', 'asc');
    }

    public function builderPageTableLoad(): void
    {
        $this->builder = $this->with(['material', 'baseType']);
    }

    public function builderPageImageLoad(): void
    {
        $this->builder = $this->select('id', 'basket', 'stone_no', 'type', 'description')
            ->with(['media' => function ($query) {
                $query->select('*')->orderBy('order_column');
            }]);
    }

    public function builderShowLocate(array $v): void
    {
        $this->builder->where('basket', '=', $v["params"]["basket"])->where('stone_no', '=', $v["params"]["stone_no"]);
    }

    public function builderView0Load(): void
    {
        $this->builder = self::with([
            'media' => function ($query) {
                $query->orderBy('order_column');
            },
            'model_tags.tag_group',
            'global_tags.tag_group',
            'material',
            'baseType',
        ])
            ->leftJoin('loci', function (JoinClause $join) {
                $join->on('loci.name', '=', 'stones.locus')->on('loci.area', '=', 'stones.area');
            })->select('stones.*', 'loci.id AS locus_id');
    }

    public function builderView0PostLoad(object $item): array
    {
        //if no related locus found, unset $item.locus_id and return "empty" related values
        if (is_null($item["locus_id"])) {
            unset($item->locus_id);
            return [];
        }

        $lm = new Locus;
        $related = $lm->meAndRelated($item->locus_id);
        unset($item->locus_id);
        return $related;
    }

    public function builderShowCarouselLoad(): void
    {
        $this->builder =  $this->select('id', 'basket', 'stone_no', 'type', 'description')->with("media");
    }

    public function discreteColumns(Model $fields): array
    {
        $material = 'Material' . '.' . $fields["material"]["name"];
        $base_type = 'Basic Typology' . '.' . $fields["baseType"]["name"];
        unset($fields->material);
        unset($fields->baseType);
        return [$material, $base_type];
    }
}
