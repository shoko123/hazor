<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\App\DigModel;
use App\Models\DigModels\Stone;
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
        //$res = Stone::selectRaw('id,  area, locus, basket_orig, basket, stone_no')->where('basket', 'regexp', '[.]\d$')->get();
        //$res = Stone::selectRaw('id,  area, locus, basket, stone_no, description')->where('basket', 'regexp', '^[^0-9]{1,9}$')->get();
        $res = Stone::selectRaw('id,  area, locus, basket, stone_no, description')->whereNull('basket')->get();
        foreach ($res as $r) {
          
            //$r->edit_notes = $r->edit_notes . 'basket(' . $r->basket . ')';
            // $r-> stone_no = intval(substr($r->basket, -1), 10);
            // $r->basket = substr($r->basket, 0, -2);
            // $r->save();
            array_push($updated, $r );
        }

        return response()->json([
            "msg" => "selection completed!",
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
