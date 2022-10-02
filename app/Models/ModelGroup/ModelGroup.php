<?php

namespace App\Models\ModelGroup;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Exception;
use App\Models\Interfaces\ModelGroupInterface;
use App\Models\Tags\TagGroup;




abstract class ModelGroup
{
    abstract public static function getModelGroups(): array;
    abstract public static function getModelGroupNames(): array;

    protected $eloquent_model_name;
    protected static $groups;

    public function __construct($eloquent_model_name = null)
    {
        $this->eloquent_model_name = $eloquent_model_name;     
    }

    public function getModelGroup(string $group_name): array
    {
        return self::$groups[$group_name];
    }

    public function getGroupDetails($group_name): array
    {
        $group = $this->getModelGroup($group_name) ?? null;
        if (is_null($group)) {
            throw new Exception("***MODEL INIT() ERROR*** Group * " . $group_name . " * NOT FOUND");
        }
        switch ($group["group_type_code"]) {
                //global tags
            case "TG":
                return $this->getGlobalTagsGroupDetails($group_name, $group);

                //model tags
            case "TM":
                return $this->getModelTagsGroupDetails($group_name, $group);

                //column values
            case "CV":
                return $this->getColumnGroupDetails($group_name, $group);

                //lookup values
            case "LV":
                return $this->getLookupGroupDetails($group_name, $group);

            case "TS":
                return $this->getTextualSearchFields($group_name, $group);
        }
        return [];
    }

    private function getLookupGroupDetails($group_name, $group)
    {
        $params = DB::table($group["table_name"])->get();
        return array_merge($group, [
            "group_name" => $group_name,
            "params"  => $params
        ]);
    }

    private function getModelTagsGroupDetails($group_name, $group)
    {
        $tagGroupName = "App\\Models\\Tags\\" . $this->eloquent_model_name . "TagGroup";
        $tg = new $tagGroupName;

        $tagGroup = $tg->with(['tags' => function ($q) {
            $q->select('id', 'name', 'group_id');
        }])
            ->select('id', 'multiple')
            ->where('name', $group_name)
            ->first();

        if (is_null($tagGroup)) {
            throw new Exception("***MODEL INIT() ERROR*** Group * " . $group_name . " * NOT FOUND");
            //dd("***MODEL INIT() ERROR*** Group \"" . $data->name . "\" NOT FOUND");
        }

        return array_merge($group, [
            "group_name" => $group_name,
            "group_id" => $tagGroup->id,
            "params"  => $tagGroup->tags->map(function ($y) {
                return ["id" => $y->id, "name" => $y->name];
            }),
        ]);
    }

    private function getGlobalTagsGroupDetails($group_name, $group)
    {
        $gtg = TagGroup::with(['tags' => function ($q) {
            $q->select('id', 'name', 'group_id');
        }])
            ->select('id', 'name')
            ->where('name', $group_name)
            ->first();

        return array_merge($group, [
            "group_name" => $group_name,
            "group_id" => $gtg->id,
            "params"  => $gtg->tags->map(function ($y) {
                return ["id" => $y->id, "name" => $y->name];
            }),
        ]);
    }
    private function getColumnGroupDetails($group_name, $group)
    {
        $params = DB::table($group["table_name"])->select($group["column_name"])->distinct()->orderBy($group["column_name"])->get();

        return array_merge($group, [
            "group_name" => $group_name,
            "params"  => $params->map(function ($y, $key) {
                return ["id" => $key, "name" => $y->area];
            })
        ]);
    }

    private function getTextualSearchFields($group_name, $group)
    {
        //return $this->getConnection()->getSchemaBuilder()->getColumnListing($this->getTable());

        return [
            "group_type_code" => "TS",
            "group_name" => "Text Search",
            //"params" => $this->getConnection()->getSchemaBuilder()->getColumnListing($this->getTable())
        ];
    }

    public function buildTrio($cats): array
    {
        $trio = [];
        foreach ($cats as $name => [$group_names]) {
            $category = ["name" => $name, "groups" => []];
            foreach ($group_names as $group_name) {
                array_push($category["groups"], $this->getGroupDetails($group_name));
            }
            array_push($trio, $category);
        }
        return ["trio" => $trio];
    }
}
