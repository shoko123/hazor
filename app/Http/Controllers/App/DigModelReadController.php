<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\Interfaces\DigModelInterface;
use App\Models\Interfaces\ModelGroupInterface;

class DigModelReadController extends Controller
{
    protected $model_name = null;
    protected $model = null;

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
            "page" => $m->page($r["ids"], $r["view"]),
        ], 200);
    }

    public function show(Request $r, DigModelInterface $m)
    {
        $id = $m->getIdFromUrlId($r["url_id"]);

        $resp = array_merge($m->show($id), [
            "msg" => "ModelControler.show(",
            "url_id" => $r["url_id"]
        ]);
        return response()->json($resp, 200);
    }

    public function carousel(Request $r, DigModelInterface $m)
    {
        $id = $m->getIdFromUrlId($r["url_id"]);
        return response()->json([
            "msg" => "ModelControler.carousel()",
            "item" => $m->carousel($id),
        ], 200);
    }

    public function destroy($id)
    {
        return response()->json([
            "msg" => "ModelControler.destroy()",
            "model_name" => $this->model_name
        ], 200);
    }

    public function firstUrlId(DigModelInterface $m)
    {
        $first = $m->firstUrlId();
        return response()->json([
            "bla" => "bla",
            "url_id" => $first,
        ], 200);
    }
}
