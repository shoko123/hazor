<?php

namespace App\Models\Functional;

use App\Models\App\DigModel;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
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
    }

    public static function carousel($id)
    {
        $media = SpatieMedia::findOrFail($id);
        return [
            'id' => $id,
            'full' => $media->getPath(),
            'tn' =>  $media->getPath('tn'),
            'description' => $media->description,
            'collection_name' => $media->collection_name,
            'order_column' => $media->order_column
        ];
    }

    public function upload(Request $r, DigModel $dm)
    {
        try {
            $item = $dm::findOrFail($r["id"]);

            //attach media to item
            foreach ($r["media_files"] as $key => $media_file) {
                $item
                    ->addMedia($media_file)
                    ->toMediaCollection($r["media_collection_name"]);
            }

            $item = $dm::with('media')->findOrFail($r["id"]);

            return self::getMedia($item->media);
        } catch (Exception $error) {
            throw new Exception('Failed to upload media. error: ' . $error);
        }
    }

    public static function getMedia(MediaCollection $mc)
    {
        //ATTENTION these have to match the groups in global_tag_groups.Media
        $collection_order = ['Plan', 'Drawing', 'Photo and Drawing', 'Photo', 'Misc'];
        $ordered =  collect([]);

        foreach ($collection_order as $collection_name) {
            foreach ($mc as $med) {
                if ($med->collection_name === $collection_name) {
                    $ordered->push(['full' => $med->getPath(), 'tn' =>  $med->getPath('tn'), 'id' => $med['id'], 'description' => $med['description']]);
                }
            }
        }

        $page  = $ordered->take(18);
        $page->all();
        $media1 = count($mc) === 0 ? null : $page[0];

        $ordered->transform(function ($item, $key) {
            return $item['id'];
        });

        return ['media1' => $media1, 'mediaPage' => $page, 'mediaArray' => $ordered];
    }

    public static function destroy(Request $r)
    {
        //Get media record by media_id
        $mediaToDelete = SpatieMedia::findOrFail($r["media_id"]);

        //verify that this media record matches item sent (by model_type and model_id)
        if (($mediaToDelete['model_type'] !== $r["model_type"]) || $mediaToDelete['model_id'] !== $r["model_id"]) {
            throw new Exception('Media/Model mismatch');
        }

        //delete
        $mediaToDelete->delete();

        //get updated media for item
        $mediaCollection = SpatieMedia::where('model_id', '=', $r["model_id"])->where('model_type', '=', $r["model_type"])->get();

        return self::getMedia($mediaCollection);
    }
}
