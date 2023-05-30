<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;

use App\Models\App\DigModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\TagSyncRequest;
use App\Models\Functional\TagModel;
class TagController extends Controller
{
    public function sync(TagSyncRequest $r, DigModel $m, TagModel $tagModel)
    {
        $validated = $r->validated();
        return response()->json([
            "msg" => "TagController.sync()",
            "res" => $tagModel->sync($validated, $m)//"Yeah"//$res
        ], 200);
    }

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
