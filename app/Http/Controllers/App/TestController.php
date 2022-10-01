<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\App\ModelController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TestController extends ModelController
{
    public function test(Request $r)
    {
        $this->createModel($r["model"]);
        $res = $this->model->with(['global_tags' => function ($q) {
            $q->select('id', 'name', 'group_id');
        }, 'model_tags'])
            ->select('*')
            ->where('id',1)
            ->first();

        return response()->json(["res" => $res], 200);
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
