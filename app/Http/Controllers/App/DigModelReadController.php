<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\App\DigModel;
use App\Http\Requests\ShowParamsRequest;

class DigModelReadController extends Controller
{
    protected $model_name = null;
    protected $model = null;

    public function index(Request $r, DigModel $m)
    {
        $collection = $m->index($r["query"]);
        return response()->json([
            "msg" => "ModelController.index(" .  $this->model_name . ")",
            "collection" => $collection,
        ], 200);
    }

    public function page(Request $r, DigModel $m)
    {
        return response()->json([
            "page" => $m->page($r["ids"], $r["view"]),
        ], 200);
    }

    public function show(ShowParamsRequest $validator, DigModel $m)
    {     
        $v = $validator->validated();
        
        $resp = array_merge($m->show($v), [
            "msg" => "ModelControler.show(",
            "slug" => $v["slug"]
        ]);
        return response()->json($resp, 200);
    }

    public function carousel(Request $r, DigModel $m)
    {
        $modelToTableName = [
            "Locus" => "loci",
            "Stone" => "stones",
            "Fauna" => "fauna"
        ];    
        $validation_string = 'exists:' . $modelToTableName[$r["model"]] . ',id';
        $v = $r->validate([
            'id' => $validation_string
        ]);
        return response()->json($m->carousel($v["id"]), 200);
    }

    public function destroy($id)
    {
        return response()->json([
            "msg" => "ModelControler.destroy()",
            "model_name" => $this->model_name
        ], 200);
    }

    public function firstSlug(DigModel $m)
    {
        $first = $m->firstSlug();
        return response()->json([
            "message" => "ReadController.firstSlug()",
            "slug" => $first,
        ], 200);
    }
}
