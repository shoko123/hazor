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
    public function storeMedia(Request $r): JsonResponse
    {
        try {
            $dm = new DigModel($r["model"]);
            $item = $dm::findOrFail($r["id"]);

            //attach media to item
            foreach ($r->media_files as $key => $media_file) {
                $item
                    ->addMedia($media_file)
                    ->toMediaCollection($r["media_type"]);
            }

            //reload updated media collection for item
            $item = $dm::with('media')->findOrFail($r["id"]);


            return response()->json([
                "message" => "succesfully stored media",
                "primary" => "I am primary media",
                "collection" => ["1", ["2"]],
                "item_with_media" => $item,
            ]);
        } catch (\Exception $error) {
            return response()->json(["error" => $error->getMessage()], 500);
        }
    }
}
