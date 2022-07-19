<?php

namespace App\Http\Controllers\Dig;

use App\Http\Controllers\Dig\FindController;
use App\Http\Requests\FindStoreRequest;
use App\Http\Requests\FaunaStoreRequest;
use App\Models\Find;
use App\Models\Dig\Fauna;
use App\Models\Dig\Locus;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;

class FaunaController extends FindController
{
    public function __construct()
    {
        $this->createModel('Fauna');
        //DigController::__construct('Fauna');
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

    public function media(Request $r)
    {
        return response()->json([
            "msg" => "dig.media() from DigController",
            "model_name" => $this->model_name
        ], 200);
    }

    public function tags(Request $r)
    {
        return response()->json([
            "msg" => "dig.tags() from DigController",
            "model_name" => $this->model_name
        ], 200);
    }
}
