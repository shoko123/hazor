<?php

namespace App\Models\DigModels;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Database\Eloquent\Model;
use App\Models\App\FindModel;
use App\Models\App\DigModel;
use App\Models\Tags\FaunaTag;
use App\Models\Tags\Tag;
use App\Models\Lookups\FaunaScope;
use App\Models\Lookups\FaunaMaterial;
use App\Models\Lookups\FaunaTaxon;
use App\Models\Lookups\FaunaSymmetry;
use App\Models\Lookups\FaunaFusion;

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

    public function scope()
    {
        return $this->belongsTo(FaunaScope::class, 'scope_id');
    }

    public function base_taxon()
    {
        return $this->belongsTo(FaunaTaxon::class, 'base_taxon_id');
    }

    public function material()
    {
        return $this->belongsTo(FaunaMaterial::class, 'material_id');
    }

    public function symmetry()
    {
        return $this->belongsTo(FaunaSymmetry::class, 'symmetry_id');
    }

    public function fusion_proximal()
    {
        return $this->belongsTo(FaunaFusion::class, 'fusion_proximal_id');
    }

    public function fusion_distal()
    {
        return $this->belongsTo(FaunaFusion::class, 'fusion_distal_id');
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
        switch ($this->scope_id) {
            case 1:
            case 30:
                return 'Non Diagnostic Animal Bone';

            case 10:
            default:
                return $this->taxon . '. ' . $this->element;

                // case 'Unassigned':
                // case 'Undefined Collection':
                //     return 'Non Diagnostic Animal Bone';

                // case 'Single Anatomical Element':
                // default:
                //     return $this->taxon . '. ' . $this->element;
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
        $this->builder = $this->with(['symmetry']);
    }

    public function builderPageImageLoad(): void
    {
        $this->builder = $this->select('id', 'label', 'taxon', 'element')
            ->with(['media' => function ($query) {
                $query->select('*')->orderBy('order_column');
            }, 'scope']);
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
        $this->builder =  $this->select('id', 'label', 'scope_id', 'taxon', 'element')->with("media");
    }
}
