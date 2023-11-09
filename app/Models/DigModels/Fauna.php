<?php

namespace App\Models\DigModels;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Database\Eloquent\Model;
use App\Models\App\FindModel;
use App\Models\App\DigModel;
use App\Models\Tags\FaunaTag;
use App\Models\Tags\Tag;
use App\Models\Lookups\FaunaElement;
use App\Models\Lookups\FaunaTaxon;


class Fauna extends FindModel
{
    protected $table = 'fauna';
    public $timestamps = false;
    protected $guarded = [];
    protected $appends = ['slug', 'short'];

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
        return $this->belongsTo(FaunaTaxon::class, 'base_taxon_id');
    }

    public function base_element()
    {
        return $this->belongsTo(FaunaElement::class, 'base_element_id');
    }

    public function init(): array
    {
        return [
            "message" => $this->eloquent_model_name . '.init()',
            "counts" => ["items" => $this->count(), "media" => DB::table('media')->where('model_type', 'Fauna')->count(),],
            "item_views" => config('app_specific.display_options.item_views.Fauna'),
        ];
    }

    public function getSlugAttribute()
    {
        return $this->label;
    }

    public function getShortAttribute()
    {
        if ($this->diagnostic) {
            return $this->taxon;
        } else {
            return 'Non Diagnostic Animal Bone';
        }
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
         $this->builder = $this->with(['base_taxon', 'base_element']);
    }

    public function builderPageImageLoad(): void
    {
        $this->builder = $this->select('id', 'label')
            ->with(['media' => function ($query) {
                $query->select('*')->orderBy('order_column');
            }]);
    }

    public function builderShowLocate(array $v): void
    {
        $this->builder->where('label', '=', $v["params"]["label"]);
    }

    public function builderView0Load(): void
    {
        $this->builder = self::with([
            'media' => function ($query) {
                $query->orderBy('order_column');
            },
            'model_tags.tag_group',
            'global_tags.tag_group',
            'base_taxon',
            'base_element',
        ])
            ->leftJoin('loci', function (JoinClause $join) {
                $join->on('loci.name', '=', 'fauna.locus')->on('loci.area', '=', 'fauna.area');
            })->select('fauna.*', 'loci.id AS locus_id');
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
        $this->builder =  $this->select('id', 'label', 'snippet')->with("media");
    }

    public function discreteColumns(Model $fields): array
    {
        $c1 = 'Element' . '.' . $fields->base_element->name;
        $c2 = 'Base Taxon' . '.' . $fields->base_taxon->name;
        unset($fields->base_element);
        unset($fields->base_taxon);
        return [$c1, $c2];
    }
}
