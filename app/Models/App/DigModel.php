<?php

namespace App\Models\App;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

use Exception;

abstract class DigModel extends Model implements HasMedia
{
    use  InteractsWithMedia;
    public $timestamps = false;
    protected $guarded = [];
    protected $eloquent_model_name;

    public function __construct($eloquent_model_name = null)
    {
        $this->eloquent_model_name = $eloquent_model_name;
    }

    abstract function buildSqlDescription() : string;
    abstract function buildSqlUrlId() : string;

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
        $url_id = $this->buildSqlUrlId();
        $builder = (object)[];
        $builder = $this->select('id', DB::raw($url_id));
        $collection = $builder->take(40)->get();
        return $collection;
    }
    public function page($r)
    {
     
        $ids = implode(',', $r["ids"]);
        $desc = $this->buildSqlDescription();
        $urlId = $this->buildSqlUrlId();

        $items = $this->whereIn('id', $r["ids"])
            ->select('id', DB::raw($desc), DB::raw($urlId))
            ->orderByRaw(DB::raw("FIELD(id, $ids)"))
            ->get();

        if ($r["view"]  === "Media") {
            foreach ($items as $index => $item) {
                //$media = $this->primaryMedia($item);
                $item["primaryMedia"] = null;
             
            }
        }
        return $items;
    }
}
