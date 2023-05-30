<?php

namespace App\Models\Functional;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use App\Models\App\DigModel;
use Illuminate\Support\Facades\Storage;

use App\Models\Interfaces\MediaModelInterface;
use Spatie\MediaLibrary\MediaCollections\Models\Media as SpatieMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection;
//use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Collection;
use Exception;

class TagModel
{
    public function sync(array $validated, DigModel $model)
    {
        //get item with tags
        $item = $model->with(['model_tags'  => function ($query) {
            $query->select('id');
        }, 'global_tags'])->findOrFail($validated["id"]);


        //model_tags
        //**********/
        //transform 'current' and 'new' to a standard 'Collection'
        $new_ids = collect($validated["new_tag_ids"]);
        $current_ids = $item->model_tags->map(function (object $item, int $key) {
            return $item["id"];
        });

        //find required chnages
        $attach_ids = $new_ids->diff($current_ids)->values()->all();
        $detach_ids = $current_ids->diff($new_ids)->values()->all();
        //$model_changes = $this->modelTagChanges($new_ids, $current_ids);


        //save changes
        /************/
        $item->model_tags()->detach($detach_ids);
        $item->model_tags()->attach($attach_ids);







        return [
            "msg" => "Back from TagModel.sync()",
            "validate" => $validated,
            "item" => $item,
            "attach_ids" => $attach_ids,
            "detach_ids" => $detach_ids,
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
