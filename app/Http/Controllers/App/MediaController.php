<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Functional\MediaModel;

class MediaController extends Controller
{
    public function upload(Request $r)
    {
        $m = new MediaModel($r["model"]);
        $re = $m->storeMedia($r);
        return response()->json([
            "message" => "message from MediaController.store()",
            "result" =>  $re,
        ], 200);
    }
}
