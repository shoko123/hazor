<?php

namespace App\Models\ModelGroup;

use Illuminate\Support\Facades\DB;
use App\Models\Tags\TagGroup;
use Exception;

abstract class ModelGroup
{
    abstract public static function getModelGroups(): array;
    abstract public static function getModelGroupNames(): array;
    abstract public  function trio(): array;
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

            case "TG": //tags global
                return $this->getGlobalTagsGroupDetails($group_name, $group);


            case "TM": //tag smodel
                return $this->getModelTagsGroupDetails($group_name, $group);


            case "CV": //column values
            case "CR": //column registration
                return $this->getColumnGroupDetails($group_name, $group);


            case "CL": //column lookup values
                return $this->getLookupGroupDetails($group_name, $group);

            case "CS": //column search
                return $this->getTextualSearchGroupDetails($group_name, $group);

            case "BF": //bespoke
                return $this->getBespokeFilterGroupDetails($group_name, $group);


            case "OB": //order by values
                return $this->getOrderByDetails($group_name, $group);
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
            "multiple" => $tagGroup->multiple,
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
            "multiple" => true,
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

    private function getTextualSearchGroupDetails($group_name, $group)
    {
        $group = $this->getModelGroup($group_name) ?? null;
        if (is_null($group)) {
            throw new Exception("***MODEL INIT() ERROR*** Group * " . $group_name . " * NOT FOUND");
        }

        return [
            "group_type_code" => "CS",
            "group_name" => $group_name,
            "column_name" => $group["column_name"],
            "params" => [["name" => "term1"], ["name" => "term2"], ["name" => "term3"], ["name" => "term4"], ["name" => "term5"], ["name" => "term6"]]
        ];
    }

    private function getBespokeFilterGroupDetails($group_name, $group)
    {
        $paramsFormatted = collect($group["params"])->map(function ($y, $key) {
            return ["id" => $key, "name" => $y];
        });
        $group["params"] = $paramsFormatted;
        $group["group_name"] = $group_name;
        return $group;
    }

    private function getOrderByDetails($group_name, $group)
    {
        return array_merge($group, [
            "params" => [["name" => "ob1"], ["name" => "ob2"], ["name" => "ob3"], ["name" => "ob4"]],
            "group_name" => $group_name,
        ]);
    }

    public function buildTrio($cats): array
    {
        $trio = [];
        foreach ($cats as $name => $group_names) {
            $category = ["name" => $name, "groups" => []];
            foreach ($group_names as $group_name) {
                array_push($category["groups"], $this->getGroupDetails($group_name));
            }
            array_push($trio, $category);
        }
        return ["trio" => $trio];
    }
}
