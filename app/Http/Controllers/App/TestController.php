<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\App\DigModel;
use App\Models\DigModels\Stone;
use App\Models\DigModels\Fauna;
use Spatie\MediaLibrary\MediaCollections\Models\Media as SpatieMedia;

class TestController extends Controller
{
    public function run(Request $r)
    {
        if(app()->environment(['production'])) {
            return response()->json([
                "msg" => "Test unavailable in production!",
            ], 403);
        }

        $updated = [];
        $res = Fauna::select('id', 'area', 'locus')->where('area', '=', 'Area A23')->get();
        //->whereIn('area_orig', ['- (no tag)'])->get();
        //->whereNull('area')->get();      
        foreach ($res as $r) {
                //$r->area = 'XX';
                //$r->edit_notes = 'Original Area('. $r->area_orig . ') ';
                //$r->save();
                array_push($updated, $r);
        }

        return response()->json([
            "msg" => "update completed!",
            "cnt" => count($updated),            
            "updated" => $updated,

        ], 200);



        $stones = Stone::select('id', 'area', 'area_orig', 'edit_notes')->whereNull('area')->get();        
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
