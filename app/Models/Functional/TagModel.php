<?php

namespace App\Models\Functional;

use Illuminate\Support\Facades\DB;
use App\Models\App\DigModel;
use Exception;

class TagModel
{
    public function sync(array $validated, DigModel $model)
    {
        //get item with tags
        $item = $model->with([
            'model_tags'  => function ($query) {
                $query->select('id');
            },
            'global_tags'  => function ($query) {
                $query->select('id');
            }
        ])->findOrFail($validated["id"]);


        //model_tags
        //**********/
        //transform 'current' and 'new' to a standard 'Collection'
        $new_model_ids = isset($validated["model_tag_ids"]) ? collect($validated["model_tag_ids"]) : collect([]);
        $current_model_ids = collect($item->model_tags->map(function (object $item, int $key) {
            return $item["id"];
        }));

        //find required changes
        $attach_model_ids = $new_model_ids->diff($current_model_ids)->values()->all();
        $detach_model_ids = $current_model_ids->diff($new_model_ids)->values()->all();

        //ids - global_tags
        //******************/
        $new_ids = isset($validated["ids"]) ? collect($validated["ids"]) : collect([]);
        $current_ids = collect($item->global_tags->map(function (object $item, int $key) {
            return $item["id"];
        }));
        
        //find required changes
        $attach_ids = $new_ids->diff($current_ids)->values()->all();
        $detach_ids = $current_ids->diff($new_ids)->values()->all();

        //column values
        /**************/
        foreach ($validated["columns"] as $col) {
            $item[$col["column_name"]] = $col["val"];
        }
        
        //save changes
        /************/
        DB::transaction(function () use ($item, $detach_model_ids, $attach_model_ids, $attach_ids, $detach_ids) {
            $item->save();
            $item->model_tags()->detach($detach_model_ids);
            $item->model_tags()->attach($attach_model_ids);
            $item->global_tags()->detach($detach_ids);
            $item->global_tags()->attach($attach_ids);
        });

        $all_tags = collect([]);
        $item = $model::with([
            'model_tags.tag_group',
            'global_tags.tag_group',
            'material',
            'baseType'
        ])->findOrFail($validated["id"]);

        foreach ($item->model_tags as $tag) {
            $all_tags->push($tag->tag_group->name . '.' . $tag->name);
        }

        foreach ($item->global_tags as $tag) {
            $all_tags->push($tag->tag_group->name . '.' . $tag->name);
        }
        foreach ($validated["columns"] as $col) {
            $all_tags->push($col["paramKey"]);
        }
       
        return [
            "msg" => "Back from TagModel.sync()",
            // "validate" => $validated,
            // "item" => $item,
            // "attach_model_ids" => $attach_model_ids,
            // "detach_model_ids" => $detach_model_ids,
            // "attach_ids" => $attach_ids,
            // "detach_ids" => $detach_ids,
            "all_tags" => $all_tags->toArray(),
            "columns" => $validated["columns"]
        ];
    }




    public function lookups(array $lvs)
    {
        function updatePreservationId($model, $item_id, $preservation_id)
        {
            DB::table('finds')->where('findable_type', $model)
                ->where('findable_id', $item_id)
                ->update(['preservation_id' => $preservation_id]);
        }



        $model = 'App\Models\Dig\\' . $lvs["digModel"];
        $item = $model::with('find')->find($lvs["id"]);

        foreach ($lvs["list"] as $x) {
            if ($x["column_name"] === "preservation_id") {
                updatePreservationId($lvs["digModel"], $lvs["id"], $x["id"]);
            } else {
                $item[$x["column_name"]] = $x["id"];
            }
        }
        $item->save();

        return response()->json([
            "**** back from lookup find_id" => "rom tag/lookups",
        ], 200);
    }
}
