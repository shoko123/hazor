<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AppController extends Controller
{


    public function init(Request $r)
    {
        return response()->json([
            "msg" => "AppController.init()",
        ], 200);
    }

    public function totals()
    {
        $tables = ['loci', 'fauna'];
        $totals = [];
        foreach ($tables as $t) {
            array_push($totals, [
                'table_name' => $t,
                'cnt' => DB::table($t)->count(),
            ]);
        }

        return response()->json([
            "msg" => "AppController.totals",
            "totals" => $totals,

        ], 200);
    }
}
