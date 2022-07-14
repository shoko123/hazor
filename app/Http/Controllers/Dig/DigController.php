<?php

namespace App\Http\Controllers\Dig;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DigController extends Controller
{
    public $model_full_path = null;
    protected $model_name = null;

    protected $model = null;

    public function __construct(String $model_name)
    {
        $this->model_full_path = "App\Models\Dig\\" . $model_name . "\\" . $model_name;
        $this->model = new ($this->model_full_path);
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
