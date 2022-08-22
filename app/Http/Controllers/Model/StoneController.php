<?php

namespace App\Http\Controllers\Model;

use App\Http\Controllers\App\ModelController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StoneController extends ModelController
{
    public function __construct()
    {
        $this->createModel('Locus');
    }

    public function store(Request $r)
    {
        return response()->json([
            "msg" => "dig.store() from DigController",
            "model_name" => $this->model_name
        ], 200);
    }

    public function destroy($id)
    {
        return response()->json([
            "msg" => "dig.destroy() from DigController",
            "model_name" => $this->model_name
        ], 200);
    }
}
