<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use App\Models\App\DigModel;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Interfaces\DigModelInterface;
use App\Models\Functional\MediaModel;


class MediaController extends Controller
{
    public function upload(Request $r, DigModel $dm)
    {
        //$m = new MediaModel($r["model"]);
        $m = new MediaModel();
        $re = $m->storeMedia($r, $dm);
        return response()->json([
            "message" => "message from MediaController.upload()",
            "result" =>  $re,
        ], 200);
    }

    public function page(Request $r)
    {
        $res = MediaModel::page($r["ids"], "regular");
        
        return response()->json([
            "message" => "message from MediaController.page()",
            "res" =>  $res,
        ], 200);
    }
  
    public function carousel(Request $r)
    {
        $res = MediaModel::carousel($r["id"]);
        
        return response()->json($res, 200);
    }

}
