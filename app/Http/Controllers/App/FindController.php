<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\App\ModelController;
use App\Http\Requests\FindStoreRequest;
use App\Http\Requests\StoneStoreRequest;
use App\Models\Find;
use App\Models\Model\Locus;
use App\Models\Model\Stone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FindController extends ModelController
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
