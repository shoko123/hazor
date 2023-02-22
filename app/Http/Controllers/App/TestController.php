<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Interfaces\DigModelInterface;

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
        $tables = ['loci', 'fauna'];
        $totals = [];
        foreach ($tables as $t) {
            array_push($totals, [
                'table_name' => $t,
                'cnt' => DB::table($t)->count(),
            ]);
        }

        return response()->json([
            "msg" => "TestController.status",
            "totals" => $totals,

        ], 200);
    }
}
