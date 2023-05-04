<?php

namespace App\Models\DigModels;

use Illuminate\Support\Facades\DB;

use App\Models\App\DigModel;
use App\Models\App\FindModel;
use App\Models\Tags\StoneTag;
use App\Models\Tags\Tag;
use App\Http\Requests\DigModelStoreRequest;
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
            "counts" => ["items" => $this->count(), "media" => DB::table('media')->where('model_type', 'Stone')->count(),],
            "itemViews" => config('display_options.itemViews.Stone'),
        ];

        //DB::table('media')->where('model_type', self::$moduleName)->count();

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
