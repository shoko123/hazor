<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\App\DigModel;
use App\Models\DigModels\Locus;
use App\Models\DigModels\Tags\LocusTag;
use Spatie\MediaLibrary\MediaCollections\Models\Media as SpatieMedia;

class TestController extends Controller
{
    public function run(Request $r)
    {
        if (app()->environment(['production'])) {
            return response()->json([
                "msg" => "Test unavailable in production!",
            ], 403);
        }

        $updated = [];
        $res = Locus::where('s6_no', 10)->get();

        foreach ($res as $r) {
            // $tag_id = 0;
            // switch ($r->s2_ext) {
            //     case null:
            //     case 0:
            //          $tag_id = 300;
            //         break;
            //     case 'a':
            //         $tag_id = 301;
            //         break;
            //     case 'b':
            //         $tag_id = 302;
            //         break;
            //     case 'c':
            //         $tag_id = 303;
            //         break;

            //     default:
                   
            // }
            $r->model_tags()->attach(300);

            array_push($updated, $r->id);
        }

        return response()->json([
            "msg" => "update completed!",
            "cnt" => count($updated),
            "updated" => $updated,

        ], 200);
    }

    public function status(Request $r)
    {
        $media = SpatieMedia::whereIn('id', array(1, 2, 3))->get();
        $totals = [];

        $m = collect([]);
        foreach ($media as $med) {
            $m->push(['full' => $med->getPath(), 'tn' =>  $med->getPath('tn'), 'id' => $med['id']]);
        }
        return response()->json([
            "msg" => "TestController.status",
            "totals" => $totals,
            "media" => $m
        ], 200);
    }
}
