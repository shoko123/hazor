<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\App\DigModelInterface;

class ModelController extends Controller
{
    protected $model_name = null;
    protected $model = null;

    public function init(Request $r, DigModelInterface $m)
    {
        return response()->json($m->init(), 200);
    }

    public function index(Request $r, DigModelInterface $m)
    {
        $collection = $m->index($r["queryParams"]);
        return response()->json([
            //"model" =>  $this->model_name,
            "msg" => "ModelController.index(" .  $this->model_name . ")",
            "collection" => $collection,
        ], 200);
    }

    public function page(Request $r, DigModelInterface $m)
    {
        return response()->json([
            //"page" => $this->model->page($r),
            "page" => $m->page($r),
        ], 200);
    }

    public function destroy($id)
    {
        return response()->json([
            "msg" => "ModelControler.destroy()",
            "model_name" => $this->model_name
        ], 200);
    }
}
