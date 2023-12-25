<?php

namespace App\Http\Controllers\App;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\App\DigModel;
use App\Models\ModelGroup\ModelGroup;

class DigModelInitController extends Controller
{
    public function init(DigModel $m, ModelGroup $mgi)
    {
        $counts =  ["items" => $m->count(), "media" => DB::table('media')->where('model_type', $m->eloquentName())->count()];
        return response()->json(array_merge(["counts" => $counts], $m->initInfo(), $mgi->trio()), 200);
    }
}
