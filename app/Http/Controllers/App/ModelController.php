<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\Interfaces\DigModelInterface;
use App\Models\Interfaces\ModelGroupInterface;

class ModelController extends Controller
{
    protected $model_name = null;
    protected $model = null;

    public function init(Request $r, DigModelInterface $m, ModelGroupInterface $mgi)
    {
        return response()->json(array_merge($m->init(), $mgi->trio()), 200);
    }

    public function index(Request $r, DigModelInterface $m)
    {
        $collection = $m->index($r["queryParams"]);
        return response()->json([
            "msg" => "ModelController.index(" .  $this->model_name . ")",
            "collection" => $collection,
        ], 200);
    }

    public function page(Request $r, DigModelInterface $m)
    {
        return response()->json([
            "page" => $m->page($r),
        ], 200);
    }

    public function show(Request $r, DigModelInterface $m)
    {
        return response()->json([
            "msg" => "ModelControler.show()",
            "item" => $m->show($r)
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
