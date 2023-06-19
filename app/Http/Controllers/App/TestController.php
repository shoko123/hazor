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
        $res = Locus::selectRaw('id,  RIGHT(name, 1) as new_addendum , name, locus_no')->where('name', 'regexp', '\d{4}[ab]{1}$')->get();
        foreach ($res as $r) {
          
            $r->addendum = $r->new_addendum;
            //$r->year = (int)$r->new_2year + 2000;
            $r->save();
            array_push($updated, $r );
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
