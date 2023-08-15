<?php

namespace App\Models\DigModels;

use Illuminate\Support\Facades\DB;
use App\Models\App\FindModel;
use App\Models\App\DigModel;
use App\Models\Tags\FaunaTag;
use App\Models\Tags\Tag;
use App\Models\Lookups\FaunaElement;
use App\Models\Lookups\FaunaTaxon;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Fauna extends FindModel
{
    protected $table = 'fauna';
    public $timestamps = false;
    protected $guarded = [];
    protected $appends = ['slug'];

    public function __construct()
    {
        DigModel::__construct('Fauna');
    }

    public function model_tags()
    {
        return $this->belongsToMany(FaunaTag::class, 'fauna-fauna_tags', 'item_id', 'tag_id');
    }

    public function global_tags()
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    public function base_taxon()
    {
        return $this->belongsTo(FaunaTaxon::class, 'taxon_id');
    }

    public function element_tag()
    {
        return $this->belongsTo(FaunaElement::class, 'element_id');
    }

    public function init(): array
    {
        return [
            "message" => $this->eloquent_model_name . '.init()',
            "counts" => ["items" => $this->count(), "media" => DB::table('media')->where('model_type', 'Fauna')->count(),],
            "itemViews" => config('display_options.itemViews.Fauna'),
        ];
    }

    public function getSlugAttribute()
    {
        return $this->label;
    }

    public function builderIndexLoad(): void
    {
        $this->builder = $this->select('id', 'label');
    }

    public function builderIndexDefaultOrder(): void
    {
        $this->builder->orderBy('label', 'asc');
    }
    
    public function builderPageTableLoad(): void
    {
        $this->builder = $this->select('*');
    }

    public function builderPageImageLoad(): void
    {
        $this->builder = $this->select('id', 'label', DB::raw('snippet AS short'))->with("media");
    }

    public function builderShowLocate(array $v): void
    {
        $this->builder->where('label', '=', $v["params"]["label"]);
    }

    public function builderShowLoad(): void
    {
        $this->builder = self::with([
            'media',
            'model_tags.tag_group',
            'global_tags.tag_group',
            'base_taxon',
            'element_tag',
        ]);
    }

    public function builderShowCarouselLoad(): void
    {
        $this->builder =  $this->select('id', 'label', DB::raw('snippet AS short'))->with("media");
    }

    public function discreteColumns(Model $fields): array
    {
        $c1 = 'Element' . '.' . $fields->element_tag->name;
        $c2 = 'Base Taxon' . '.' . $fields->base_taxon->name;
        unset($fields->element_tag);
        unset($fields->base_taxon);
        return [$c1, $c2];
    }
}
