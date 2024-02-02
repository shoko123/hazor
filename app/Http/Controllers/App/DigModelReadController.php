<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\App\DigModel;
use App\Http\Requests\ShowParamsRequest;
use App\Http\Requests\PageRequest;
use App\Http\Resources\LocusPageTabularResourceCollection;
use App\Http\Resources\StonePageTabularResourceCollection;
use App\Http\Resources\FaunaPageTabularResourceCollection;

class DigModelReadController extends Controller
{
    protected $model_name = null;
    protected $model = null;

    public function index(Request $r, DigModel $m)
    {
        $collection = $m->index($r["query"]);
        return response()->json($collection, 200);
    }


    public function page(PageRequest $r, DigModel $m)
    {
        $validated = $r->validated();

        if ($validated["view"] === "Tabular") {
            $page = $m->page($validated["ids"], $validated["view"]);

            switch ($r["model"]) {
                case "Locus":
                    return new LocusPageTabularResourceCollection($page);
                case "Stone":
                    return new StonePageTabularResourceCollection($page);
                case "Fauna":
                    return new FaunaPageTabularResourceCollection($page);
            }
        } else {
            return response()->json($m->page($validated["ids"], $validated["view"]), 200);
        }
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
