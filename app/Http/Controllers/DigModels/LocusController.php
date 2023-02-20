<?php

namespace App\Http\Controllers\DigModels;

use App\Http\Controllers\Controller;
use App\Models\Interfaces\DigModelInterface;
use Illuminate\Http\Request;

class LocusController extends Controller
{
    public function store(Request $r, DigModelInterface $m)
    {
        return response()->json([
            "msg" => "LocusController.store()",
            "model_name" => $m->model_name
        ], 200);
    }
}

