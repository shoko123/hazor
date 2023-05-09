<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\App\DigModel;
use App\Models\DigModels\Stone;
use Spatie\MediaLibrary\MediaCollections\Models\Media as SpatieMedia;

class TestController extends Controller
{
    public function test(Request $r, DigModel $m)
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
        $formatted = [];

        $stones = Stone::select('id', 'date_orig', 'date', 'year')->get();
        foreach ($stones as $r) {
            if (is_numeric($r->date_orig)) {
                $r->year = intval($r->date_orig);
                $r->save();
                array_push($formatted, $r);
            }
        }

        return response()->json([
            "msg" => "copied years",
            "formatted" => $formatted,
            "cnt" => count($formatted)
        ], 200);


        //$stones = Stone::select('id', 'date_orig', 'date', 'year')->where('date_orig', 'LIKE', '%/%')->get();



        foreach ($stones as $r) {
            $p = explode("/", $r->date_orig);
            $year = "";
            $new = "";
            if (count($p) === 3) {
                $y = intval($p[2]);
                if (($y > 80  && $y < 100)) {
                    $year = "19" .  str_pad($y, 2, '0', STR_PAD_LEFT);
                } else  if ($y >= 0  && $y <= 50) {
                    $year = "20" .  str_pad($y, 2, '0', STR_PAD_LEFT);
                } else  if ($y >= 1990) {
                    $year = $y;
                }
                $new = $year . '-' . str_pad($p[1], 2, '0', STR_PAD_LEFT) . '-' . str_pad($p[0], 2, '0', STR_PAD_LEFT);
                $r->date = $new;
                $r->year = intval($year);
                $r->save();
                array_push($formatted, $r);
            }
        }

        return response()->json([
            "msg" => "Date done!",
            "formatted" => $formatted,
            "cnt" => count($formatted)
        ], 200);





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
