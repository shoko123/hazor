<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\App\DigModel;

class DigModelDestroyController extends Controller
{
    public function destroy(Request $r, DigModel $m)
    {
        $r =  $m->destroyItem($r["id"]);
        return response()->json([
            "message" => "item deleted successfully",
            "deleted_item" => $r
        ], 200);
    }
}
