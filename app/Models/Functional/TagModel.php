<?php

namespace App\Models\Functional;

use Illuminate\Support\Facades\DB;
use App\Models\App\DigModel;

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

        
        //Return 'success' or throw an exception with any failure.
        //(too lazy to re-read and format values as newItemParamKeys and column fields which
        //are already available at the front end),
        return [
            "msg" => "TagModel.sync() success"
        ];
    }
}
