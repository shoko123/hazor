<?php

namespace App\Models\Functional;

use App\Models\App\DigModel;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Interfaces\MediaModelInterface;
use Spatie\MediaLibrary\MediaCollections\Models\Media as SpatieMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection;
use Illuminate\Database\Eloquent\Collection;

use Exception;

class MediaModel implements MediaModelInterface
{
    public function __construct()
    {
        //
    }

    public static function page($ids, $view): Collection
    {
        $idsAsCommaSeperatedString = implode(',', $ids);

        $res = SpatieMedia::whereIn('id', $ids)
            ->orderByRaw("FIELD(id, $idsAsCommaSeperatedString)")
            ->get();


        $m = new Collection([]);
        foreach ($res as $med) {
            $m->push(['full' => $med->getPath(), 'tn' =>  $med->getPath('tn'), 'id' => $med['id']]);
        }
        return $m;
        ///////




        $res->transform(function ($item, $key) {
            $media = null;
            if (!$item->media->isEmpty()) {
                $media = ['full' => $item->media[0]->getPath(), 'tn' =>  $item->media[0]->getPath('tn')];
            }
            unset($item->media);
            $item->media1 = $media;
            return $item;
        });
        return $res;
    }

    public static function carousel($id)
    {
        $media = SpatieMedia::findOrFail($id);
        $res = ['full' => $media->getPath(), 'tn' =>  $media->getPath('tn'), 'id' => $id];
        return $res;
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
            //$media = $item->getMedia('photos');
            $media = $item->getMedia();
            return (object)[
                "message" => "I am the object returned from media.upload",
                "item" => $item,
                "media" => $media,
            ];
        } catch (\Exception $error) {
            return response()->json(["error" => $error->getMessage()], 500);
        }
    }
    public static function orderMedia(MediaCollection $mc)
    {
        $collection_order = ['drawing', 'drawing and photo', 'photos'];
        $media =  collect([]);

        foreach ($collection_order as $collection_name) {
            foreach ($mc as $med) {
                if($med->collection_name === $collection_name) {
                    $media->push(['full' => $med->getPath(), 'tn' =>  $med->getPath('tn'), 'id' => $med['id']]);
                }
            }
        }

        return $media;
    }
}
