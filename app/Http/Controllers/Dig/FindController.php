<?php

namespace App\Http\Controllers\Dig;

use App\Http\Controllers\Dig\DigController;
use App\Http\Requests\FindStoreRequest;
use App\Http\Requests\StoneStoreRequest;
use App\Models\Find;
use App\Models\Dig\Locus;
use App\Models\Dig\Stone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FindController extends DigController
{
    public function __construct(String $model_name)
    {
        parent::__construct($model_name);
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
