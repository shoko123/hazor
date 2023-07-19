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

    function rawSqlSlug(): string
    {
        return 'id AS slug';
    }

    public function builderPageTableSelect(): void
    {
        $this->builder = $this->select([
            'id',
            'slug' => DB::raw($this->rawSqlSlug()),
            'label',
            'area',
            'locus',
            'basket',
            'item_category',
            'biological_taxonomy',
            'has_taxonomic_identifier',
            'has_anatomical_identifier',
            'stratum',
            'taxon',
            'element',
            'fragment_present',
            'bone_number',
            'snippet',
        ]);
    }

    public function builderPageImageSelect(): void
    {
        $this->builder = $this->select('id', DB::raw($this->rawSqlSlug()), DB::raw('snippet AS short'))->with("media");
    }

    public function builderOrder(): void
    {
        $this->builder->orderBy('id', 'asc');
    }

    public function builderItemSelect(): void
    {
        $this->builder = self::select('*', DB::raw($this->rawSqlSlug()))->with([
            'media',
            'model_tags.tag_group',
            'global_tags.tag_group',
            'base_taxon',
            'element_tag',
        ]);
    }


    public function builderItemLocate(array $v): void
    {
        $this->builder->where('id', '=', $v["params"]["id"]);
    }

    public function builderItemSelectCarousel(): void
    {
        $this->builder =  $this->select('id', DB::raw($this->rawSqlSlug()), DB::raw('snippet AS short'))->with("media");
    }

    public function slugFromItem(Model $item): string
    {
        return $item["id"];
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
