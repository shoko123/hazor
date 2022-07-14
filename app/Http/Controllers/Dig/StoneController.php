<?php

namespace App\Http\Controllers\Dig;

use App\Http\Controllers\Dig\FindController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FaunaController extends FindController
{
    public function __construct()
    {
        DigController::__construct('Stone');
    }

    public function index(Request $request)
    {
        return response()->json([
            "msg" => "dig.index() from DigController",
            "model_name" => $this->model_name
        ], 200);
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
