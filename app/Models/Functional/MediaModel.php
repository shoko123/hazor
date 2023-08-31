<?php

namespace App\Models\Functional;

use App\Models\App\DigModel;
use Illuminate\Http\Request;
use Exception;

use Spatie\MediaLibrary\MediaCollections\Models\Media as SpatieMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection;
use Illuminate\Database\Eloquent\Collection;


class MediaModel
{
    public function __construct()
    {
        //
    }

    static public function media_collections()
    {
        return ['Plan', 'Drawing', 'Photo and Drawing', 'Photo', 'Misc'];
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

    public function upload(array $r, DigModel $dm)
    {
        try {
            $item = $dm::findOrFail($r["model_id"]);

            //attach media to item
            foreach ($r["media_files"] as $key => $media_file) {
                $item
                    ->addMedia($media_file)
                    ->toMediaCollection($r["media_collection_name"]);
            }

            $mediaCollection = SpatieMedia::where('model_id', '=', $r["model_id"])->where('model_type', '=', $r["model"])->get();
            return self::getMedia($mediaCollection);
        } catch (Exception $error) {
            throw new Exception('Failed to upload media. error: ' . $error);
        }
    }

    public static function getMedia(MediaCollection $mc, bool $just1 = false)
    {
        if ($just1) {
            if (empty($mc)) {
                return null;
            } else {
                return  ['id' => $mc[0]["id"], 'full' => $mc[0]->getPath(), 'urls' => ['tn' =>  $mc[0]->getPath('tn')], 'order_column' =>  $mc["order_column"], 'file_name' =>  $mc[0]["file_name"]];
            }
        }

        $mapped = $mc->map(function ($med, $key) {
            return ['id' => $med["id"], 'urls' => ['full' => $med->getPath(), 'tn' =>  $med->getPath('tn')], 'order_column' =>  $med["order_column"], 'file_name' =>  $med["file_name"]];
        });

        return $mapped;
    }

    public static function destroy(array $r)
    {
        //Get media record by media_id
        $mediaToDelete = SpatieMedia::findOrFail($r["media_id"]);

        //verify that this media record matches item sent (by model_type and model_id)
        if (($mediaToDelete['model_type'] !== $r["model"]) || $mediaToDelete['model_id'] !== $r["model_id"]) {
            throw new Exception('Media/Model mismatch abort destroy');
        }

        //delete
        $mediaToDelete->delete();

        //get updated media for item
        $mediaCollection = SpatieMedia::where('model_id', '=', $r["model_id"])->where('model_type', '=', $r["model"])->get();
        return self::getMedia($mediaCollection);
    }

    public static function reorder(array $m)
    {
        // return [
        //     "message" => "Returned form reorder",
        //     "params" => $m
        // ];

        foreach ($m["ordered"] as $possible) {
            $record = SpatieMedia::findOrFail($possible["id"]);
            //if ($record["order_column"] !== $possible["order"]) {
                $record["order_column"] = $possible["order"];
                $record->save();
            //}
        }

        //get updated media for item
        $mediaCollection = SpatieMedia::where('model_id', '=', $m["model_id"])
            ->where('model_type', '=', $m["model"])
            ->orderBy('order_column', 'asc')->get();
        return self::getMedia($mediaCollection);
    }
}
