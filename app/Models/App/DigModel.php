<?php

namespace App\Models\App;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
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

    abstract function buildSqlDescription(): string;
    abstract function buildSqlUrlId(): string;
    abstract function getTrio(): array;
    abstract function init(): array;

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

    public function index($queryParams)
    {
        $url_id = $this->buildSqlUrlId();
        $builder = (object)[];
        $builder = $this->select('id', DB::raw($url_id));
        $collection = $builder->take(5000)->get();
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
                $item["primaryMedia"] = null;
            }
        }
        return $items;
    }

    public function buildTrio($cats): array
    {
        $trio = [];


        foreach ($cats as $name => $group_names) {
            $category = ["name" => $name, "groups" => []];
            foreach ($group_names as $g) {
                array_push($category["groups"], $this->getGroupDetails($g[0], $g[1]));
            }
            array_push($trio, $category);
        }
        return $trio;
    }

    public function getGroupDetails($group_type_code, $data)
    {
        switch ($group_type_code) {
                //global tags
            case "TG":
                return $this->getGlobalTagsGroupDetails($data);

                //model tags
            case "TM":
                return $this->getModelTagsGroupDetails($data);

                //column values
            case "VC":
                return $this->getColumnGroupDetails($data);

                //lookup values
            case "LV":
                return $this->getLookupGroupDetails($data);

            case "TS":
                return $this->getTextualSearchFields();
        }
    }

    private function getLookupGroupDetails($data)
    {
        $params = DB::table($data->table_name)->get();
        return [
            "group_type_code" => "LV",
            "table_name" => $data->table_name,
            "column_name" => $data->column_name,
            "group_name" => $data->name,
            "params"  => $params
        ];
    }

    private function getModelTagsGroupDetails($data)
    {
        $tagGroupName = "App\\Models\\Tags\\" . $this->eloquent_model_name . "TagGroup";
        $tg = new $tagGroupName;

        $tagGroup = $tg->with(['tags' => function ($q) {
            $q->select('id', 'name', 'group_id');
        }])
            ->select('id', 'multiple')
            ->where('name', $data->name)
            ->first();

        return [
            "group_type_code" => "TM",
            "group_id" => $tagGroup->id,
            "group_name" => $data->name,
            "multiple" => $tagGroup->multiple,
            "params"  => $tagGroup->tags->map(function ($y) {
                return ["id" => $y->id, "name" => $y->name];
            }),
            "dependency" => null
        ];
    }

    private function getGlobalTagsGroupDetails($data)
    {
        $tagGroupName = "App\\Models\\Tags\\TagGroup";
        $tg = new $tagGroupName;
        $group =$tg->with(['tags' => function ($q) {
            $q->select('id', 'name', 'group_id');
        }])
            ->select('id', 'name')
            ->where('name', $data->name)
            ->first();

        return [
            "group_type_code" => "TG",
            "group_name" => $data->name,
            "params"  => $group->tags->map(function ($y) {
                return ["id" => $y->id, "name" => $y->name];
            }),
            "dependency" => null
        ];
    }
    private function getColumnGroupDetails($data)
    {
        $column_name = $data->column_name;
        $params = DB::table($data->table_name)->select($column_name)->distinct()->orderBy($column_name)->get();

        return [
            "group_type_code" => "VC",
            "table_name" => $data->table_name,
            "column_name" => $data->column_name,
            "group_name" => $data->column_name,
            "params" => $params->map(function ($y) use (&$column_name) {
                return $y->$column_name;
            })
        ];
    }

    private function getTextualSearchFields()
    {
        //return $this->getConnection()->getSchemaBuilder()->getColumnListing($this->getTable());

        return [
            "group_type_code" => "TS",
            "group_name" => "Text Search",
            "params" => $this->getConnection()->getSchemaBuilder()->getColumnListing($this->getTable())
        ];
    }
}
