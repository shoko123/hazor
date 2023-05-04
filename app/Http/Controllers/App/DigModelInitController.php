<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use App\Models\App\DigModel;
use App\Models\ModelGroup\ModelGroup;

class DigModelInitController extends Controller
{
    public function init(DigModel $m, ModelGroup $mgi)
    {
        return response()->json(array_merge($m->init(), $mgi->trio()), 200);
    }
}
