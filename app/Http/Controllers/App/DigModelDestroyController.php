<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\Interfaces\DigModelInterface;
use App\Models\Interfaces\ModelGroupInterface;

class DigModelDestroyController extends Controller
{
    public function destroy(Request $r, DigModelInterface $m)
    {
        $m->destroyItem($r["id"]);
        return response()->json([
            "message" => 'item with id' . $r[" id"] . " deleted successfully",
        ], 200);
    }
}
