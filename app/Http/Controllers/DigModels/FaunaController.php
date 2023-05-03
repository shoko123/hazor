<?php

namespace App\Http\Controllers\DigModels;

use App\Http\Controllers\App\ModelController;
use App\Http\Requests\FindStoreRequest;
use App\Http\Requests\FaunaStoreRequest;
use App\Http\Controllers\Controller;
use App\Models\App\DigModel;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;

class FaunaController extends Controller
{
    public function store(Request $r, DigModel $m)
    {
        return response()->json([
            "msg" => "FaunaController.store()",
            "model_name" => $m->model_name
        ], 200);
    }
}
