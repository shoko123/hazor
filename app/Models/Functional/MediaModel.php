<?php

namespace App\Models\Functional;

use App\Models\App\DigModel;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Interfaces\MediaModelInterface;
use Spatie\MediaLibrary\MediaCollections\Models\Media as SpatieMedia;
use Illuminate\Database\Eloquent\Collection;
use Exception;

class MediaModel implements MediaModelInterface
{
    public function __construct()
    {
        //
    }

    public function storeMedia(Request $r, DigModel $dm)
    {
        try {
            $item = $dm::findOrFail($r["id"]);

            //attach media to item
            foreach ($r["media_files"] as $key => $media_file) {
                $item
                    ->addMedia($media_file)
                    ->toMediaCollection($r["media_collection_name"]);
            }

            //reload updated media collection for item
            $item = $dm::findOrFail($r["id"]);
            $media = $item->getMedia('photos');
            return (object)[
                "message" => "I am the object returned from media.upload",
                "item" => $item,
                "media" => $media,
            ];
        } catch (\Exception $error) {
            return response()->json(["error" => $error->getMessage()], 500);
        }
    }

    //order media by collection_order, order_column.
    //return { media1: TApiMedia, media_ids[] }
    public function mediaForItem($item)
    {
        $collection_order = ['drawing', 'drawing and photo', 'photos'];
        $media =  collect([]);

        foreach ($collection_order as $collection_name) {
            $by_collection = $item->getMedia($collection_name);
            foreach ($by_collection as $med) {
                $media->push(['full' => $med->getPath(), 'tn' =>  $med->getPath('tn'), 'id' => $med['id']]);
            }
        }

        return [
            'media' => $media,
            'media1' => $media->isEmpty() ? null : $media[0]
        ];
    }
}
