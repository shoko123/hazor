<?php

namespace App\Http\Controllers\Model;

use App\Http\Controllers\App\ModelController;
use App\Http\Requests\FindStoreRequest;
use App\Http\Requests\FaunaStoreRequest;
use App\Models\Find;
use App\Models\Model\Fauna;
use App\Models\Model\Locus;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;

class FaunaController extends ModelController
{
    public function __construct()
    {
        parent::__construct('Fauna');
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
