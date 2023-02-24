<?php

namespace App\Models\Functional;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Interfaces\MediaModelInterface;
use App\Models\App\DigModel;
use Exception;

class MediaModel implements MediaModelInterface
{
    protected $model_name = null;
    
    public function __construct($model_name)
    {
        $this->model_name = $model_name;
    }

    public function storeMedia(Request $r)
    {
        //return $r;

        $model = 'App\Models\DigModels\\' . $r["model"];
        try {
            //$dm = new DigModel($r["model"]);
            $item = $model::findOrFail($r["id"]);
            // return (object)["message" => "I am the object returned from storeMedia",
            // "item" => $item];


            //attach media to item
            foreach ($r["media_files"] as $key => $media_file) {
                $item
                    ->addMedia($media_file)
                    ->toMediaCollection($r["media_collection_name"]);
            }

            //reload updated media collection for item
            $item = $model::with('media')->findOrFail($r["id"]);

            return (object)[
                "message" => "I am the object returned from storeMedia",
                "item_with_media" => $item,
            ];

        } catch (\Exception $error) {
            return response()->json(["error" => $error->getMessage()], 500);
        }
    }

    
}
