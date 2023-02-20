<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use App\Models\Interfaces\DigModelInterface;
use App\Models\Interfaces\ModelGroupInterface;

class DigModelInitController extends Controller
{
    public function init(DigModelInterface $m, ModelGroupInterface $mgi)
    {
        return response()->json(array_merge($m->init(), $mgi->trio()), 200);
    }
}
