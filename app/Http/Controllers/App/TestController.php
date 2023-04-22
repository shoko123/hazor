<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Interfaces\DigModelInterface;
use Spatie\MediaLibrary\MediaCollections\Models\Media as SpatieMedia;

class TestController extends Controller
{
    public function test(Request $r, DigModelInterface $m)
    {
        $res = $m->show(1);

        return response()->json(
            [
                "message" => "Hi from test!",
                "res" => $res
            ],
            200
        );
    }

    public function status(Request $r)
    {
        $media = SpatieMedia::whereIn('id', array(1, 2, 3))->get();
        $tables = ['loci', 'fauna'];
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
